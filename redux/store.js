"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/UserSlice.js";
import teamSlice from "./slice/TeamSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    team: teamSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
