import { Order } from "../model/OrderModel.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    // Validate required fields
    if (!cart || !shippingAddress || !user || !totalPrice || !paymentInfo) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    // Create the order
    const newOrder = await Order.create({
      cart,
      shippingAddress,
      user,
      totalPrice,
      paymentInfo,
    });

    return res.status(200).json({
      success: true,
      msg: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.log("Error while creating order", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
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
    const { status } = req.body;

    // Check if the order exists
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    // Update the order status
    order.status = status;

    if (status === "Delivered") {
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