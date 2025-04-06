import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    user: null,
    isInitializing: true,
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsInitializing: (state, action) => {
      state.isInitializing = action.payload;
    },
  },
});

export const { setUser, setIsInitializing } = userSlice.actions;

export default userSlice.reducer;
