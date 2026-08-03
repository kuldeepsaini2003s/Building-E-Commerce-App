import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
  },
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
  },
});

export const { setEvents } = eventSlice.actions;
export default eventSlice.reducer;
