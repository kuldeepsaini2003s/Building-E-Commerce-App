import { model, Schema } from "mongoose";

const couponCodeSchema = Schema({
  name: {
    type: String,
    required: [true, "Please enter your coupon code name!"],
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  minAmount: {
    type: Number,
  },
  maxAmount: {
    type: Number,
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const CouponCode = model("CouponCode", couponCodeSchema);

export default CouponCode
