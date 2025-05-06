import { createSlice } from "@reduxjs/toolkit";

const librarySlice = createSlice({
  name: "library",

  initialState: {
    nodeRegistry: null,
    isNodeRegistryInitializing: true,
  },

  reducers: {
    setNodeRegistry: (state, action) => {
      state.nodeRegistry = action.payload;
    },

    setIsNodeRegistryInitializing: (state, action) => {
      state.isNodeRegistryInitializing = action.payload;
    },
  },
});

export const { setNodeRegistry, setIsNodeRegistryInitializing } =
  librarySlice.actions;

export default librarySlice.reducer;
