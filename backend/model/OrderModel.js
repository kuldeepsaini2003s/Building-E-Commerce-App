import mongoose, { model, Schema } from "mongoose";

const orderSchema = Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "PLACED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
        "COD_PENDING",
      ],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["ONLINE", "COD"],
      default: "COD",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
      required: true,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    receipt: String,
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

export default Order;
