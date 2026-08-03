import { createSlice } from "@reduxjs/toolkit";

const couponCodeSlice = createSlice({
  name: "coupon",
  initialState: {
    couponCodes: [],
  },
  reducers: {
    setCouponsCodes: (state, action) => {
      state.couponCodes = action.payload;
    },
  },
});

export const { setCouponsCodes } = couponCodeSlice.actions;
export default couponCodeSlice.reducer;
