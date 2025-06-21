import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    openSlider: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    toggleSlider: (state) => {
      state.openSlider = !state.openSlider;
    },
  },
});

export const { setUser, toggleSlider } = userSlice.actions;
export default userSlice.reducer;
