import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    setCartFromLocalStorage: (state, action) => {
      state.cart = action.payload;
    },
    addToCart: (state, action) => {
      const item = state?.cart?.find(
        (item) => item?._id === action?.payload?._id
      );
      if (!item) {
        state.cart.push(action.payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    updateCartQuantity: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item._id === action.payload._id) item.qty = action.payload.qty;
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
});

export const {
  setCartFromLocalStorage,
  addToCart,
  removeFromCart,
  updateCartQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
