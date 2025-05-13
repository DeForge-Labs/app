import { createSlice } from "@reduxjs/toolkit";

const runSlice = createSlice({
  name: "run",

  initialState: {
    isRunning: false,
    type: "raw",
  },

  reducers: {
    setIsRunning: (state, action) => {
      state.isRunning = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { setIsRunning, setType } = runSlice.actions;

export default runSlice.reducer;
