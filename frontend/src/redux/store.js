import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartSlice from "./cartSlice";
import shopSlice from "./shopSlice";
import productSlice from "./productSlice";
import wishlistSlice from "./wishlistSlice";
import orderSlice from "./orderSlice";
import eventSlice from "./eventSlice";
import couponSlice from "./couponCodeSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
    product: productSlice,
    wishlist: wishlistSlice,
    shop: shopSlice,
    order: orderSlice,
    event: eventSlice,
    couponCode: couponSlice,
  },
});
