import { createSlice } from "@reduxjs/toolkit";

const templateSlice = createSlice({
  name: "template",

  initialState: {
    template: null,
    isTemplateInitializing: true,
    teams: null,
    selectedTeam: null,
    isTeamsInitializing: true,
    templates: null,
    isTemplatesInitializing: true,
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
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setIsTemplatesInitializing: (state, action) => {
      state.isTemplatesInitializing = action.payload;
    },
    setSelectedTeam: (state, action) => {
      state.selectedTeam = action.payload;
    },
  },
});

export const {
  setTemplate,
  setIsTemplateInitializing,
  setTeams,
  setIsTeamsInitializing,
  setTemplates,
  setIsTemplatesInitializing,
  setSelectedTeam,
} = templateSlice.actions;

export default templateSlice.reducer;
