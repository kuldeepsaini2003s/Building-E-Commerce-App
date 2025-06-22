import { createSlice } from "@reduxjs/toolkit";

const shopSlice = createSlice({
  name: "user",
  initialState: {
    shop: null,
    openSlider: false,
  },
  reducers: {
    setShop: (state, action) => {
      state.shop = action.payload;
    },
    toggleSlider: (state) => {
      state.openSlider = !state.openSlider;
    },
  },
});

export const { setShop, toggleSlider } = shopSlice.actions;
export default shopSlice.reducer;
