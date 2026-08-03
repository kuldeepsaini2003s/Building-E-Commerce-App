import Order from "../model/OrderModel.js";
import Razorpay from "razorpay";
import Product from "../model/ProductModel.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { products, paymentMethod = "ONLINE" } = req.body;

    // Normalize payment method to uppercase
    const normalizedPaymentMethod = paymentMethod?.toUpperCase() || "ONLINE";

    if (!userId) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Products must be an array",
      });
    }

    for (const item of products) {
      if (!item?.productId) {
        return res.status(400).json({
          success: false,
          msg: "Each product must include productId",
        });
      }
      if (
        typeof item?.quantity !== "number" ||
        item.quantity <= 0 ||
        !Number.isFinite(item.quantity)
      ) {
        return res.status(400).json({
          success: false,
          msg: "Each product must include a valid quantity",
        });
      }
    }

    let totalAmount = 0;
    const validatedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId).select(
        "discountPrice title"
      );
      if (!product) {
        return res.status(404).json({
          success: false,
          msg: `Product not found: ${item.productId}`,
        });
      }

      const itemTotal = product.discountPrice * item.quantity;
      totalAmount += itemTotal;

      validatedProducts.push({
        productId: product._id,
        title: product.title,
        quantity: item.quantity,
        price: product.discountPrice,
        totalPrice: itemTotal,
      });
    }

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        msg: "Invalid total amount",
      });
    }

    // For COD orders: Order is placed immediately, paymentMethod = COD, paymentStatus = Unpaid
    if (normalizedPaymentMethod === "COD") {
      const newOrder = await Order.create({
        user: userId,
        products: validatedProducts,
        totalAmount,
        status: "PLACED", // Order is placed immediately for COD
        paymentMethod: normalizedPaymentMethod, // "COD"
        paymentStatus: "Unpaid", // Payment will be collected on delivery
        receipt: `receipt_${Date.now()}`,
      });

      return res.status(201).json({
        success: true,
        msg: "Order created successfully",
        data: {
          ...newOrder._doc,
          razorpay: null, // No Razorpay data for COD
        },
      });
    }

    // For online payment: Order is created but not placed until payment is verified
    // Create Razorpay order first
    const options = {
      amount: Math.round(totalAmount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order with PENDING status (will be changed to PLACED after payment verification)
    const newOrder = await Order.create({
      user: userId,
      products: validatedProducts,
      totalAmount,
      status: "PENDING", // Order not placed yet, waiting for payment
      paymentMethod: normalizedPaymentMethod, // "ONLINE"
      paymentStatus: "Unpaid", // Payment not done yet
      razorpayOrderId: razorpayOrder.id,
      receipt: razorpayOrder.receipt,
    });

    return res.status(201).json({
      success: true,
      msg: "Order created successfully",
      data: {
        ...newOrder._doc,
        razorpay: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key_id: process.env.RAZORPAY_KEY_ID, // Send key_id to frontend (safe to expose)
        },
      },
    });
  } catch (error) {
    console.error("Error while creating order:", error);
    if (error.error) {
      console.error("Razorpay Error:", error.error);
    }
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      error: error.error || error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment verified: Order is now placed, paymentMethod = ONLINE, paymentStatus = Paid
      await Order.findByIdAndUpdate(orderId, {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "PLACED", // Order is placed after payment is done
        paymentStatus: "Paid", // Payment completed
      });

      return res
        .status(200)
        .json({ success: true, message: "Payment verified" });
    } else {
      // Payment verification failed
      await Order.findByIdAndUpdate(orderId, {
        status: "CANCELLED",
        paymentStatus: "Unpaid",
      });
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.log("Error while verifying payment", error);
    return res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No orders found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.log("Error while fetching orders", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

// Get all orders of a seller
export const getSellerAllOrders = async (req, res) => {
  try {
    const { shopId } = req.params;

    const orders = await Order.find({ "cart.shopId": shopId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No orders found for this seller",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.log("Error while fetching seller orders", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    // Check if the order exists
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    // Update the order status
    if (status) {
      order.status = status;
    }

    // Update payment status if provided
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // If order is delivered and it's COD, mark payment as paid
    if (status === "DELIVERED" && order.paymentMethod === "COD") {
      order.paymentStatus = "Paid";
    }

    if (status === "DELIVERED") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      msg: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.log("Error while updating order status", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the order exists
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    // Delete the order
    await Order.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      msg: "Order deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting order", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

// Get a single order by ID
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.log("Error while fetching order", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};
