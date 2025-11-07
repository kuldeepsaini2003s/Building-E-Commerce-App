import { model, Schema } from "mongoose";

const cartSchema = Schema({
  owner: {
    required: true,
    type: String,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: String,
    required: true,
  },
});

const Cart = model("Cart", cartSchema);

export default Cart