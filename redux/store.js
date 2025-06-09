"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/UserSlice.js";
import teamSlice from "./slice/TeamSlice.js";
import workflowSlice from "./slice/WorkflowSlice.js";
import librarySlice from "./slice/librarySlice.js";
import runSlice from "./slice/runSlice.js";
import templateSlice from "./slice/templateSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    team: teamSlice,
    workflow: workflowSlice,
    library: librarySlice,
    run: runSlice,
    template: templateSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
