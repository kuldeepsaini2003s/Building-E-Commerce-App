import { model, Schema } from "mongoose";

const wishlistSchema = Schema({
  owner: {
    required: true,
    type: String,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

export const Wishlist = model("Wishlist", wishlistSchema);
