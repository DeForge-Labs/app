import { createSlice } from "@reduxjs/toolkit";

const templateSlice = createSlice({
  name: "template",

  initialState: {
    template: null,
    isTemplateInitializing: true,
    teams: null,
    isTeamsInitializing: true,
  },

  reducers: {
    setTemplate: (state, action) => {
      state.template = action.payload;
    },
    setIsTemplateInitializing: (state, action) => {
      state.isTemplateInitializing = action.payload;
    },
    setTeams: (state, action) => {
      state.teams = action.payload;
    },
    setIsTeamsInitializing: (state, action) => {
      state.isTeamsInitializing = action.payload;
    },
  },
});

export const {
  setTemplate,
  setIsTemplateInitializing,
  setTeams,
  setIsTeamsInitializing,
} = templateSlice.actions;

export default templateSlice.reducer;
