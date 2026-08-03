import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
  },
  reducers: {
    setWishlistFromLocalStorage: (state, action) => {
      state.wishlist = action.payload;
    },
    addToWishlist: (state, action) => {
      const item = state?.wishlist?.find(
        (item) => item?._id === action?.payload?._id
      );
      if (!item) {
        state.wishlist.push(action.payload);
      }
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
    removeFromWishlist: (state, action) => {
      console.log(action.payload);

      state.wishlist = state.wishlist.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
  },
});

export const {
  setWishlistFromLocalStorage,
  addToWishlist,
  removeFromWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
