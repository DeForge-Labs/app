"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/UserSlice.js";
import teamSlice from "./slice/TeamSlice.js";
import workflowSlice from "./slice/WorkflowSlice.js";
import librarySlice from "./slice/librarySlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    team: teamSlice,
    workflow: workflowSlice,
    library: librarySlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
