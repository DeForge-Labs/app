import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",

  initialState: {
    team: null,
    isTeamInitializing: true,
    isWorkflowInitializing: true,
    workflows: null,
    members: null,
    isMembersInitializing: true,
    workspace: null,
    templates: null,
    defaultTemplate: null,
    isDefaultTemplatesInitializing: true,
    tab: "dashboard",
  },

  reducers: {
    setTeam: (state, action) => {
      state.team = action.payload;
    },
    setIsTeamInitializing: (state, action) => {
      state.isTeamInitializing = action.payload;
    },
    setIsWorkflowInitializing: (state, action) => {
      state.isWorkflowInitializing = action.payload;
    },
    setWorkflows: (state, action) => {
      state.workflows = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setIsMembersInitializing: (state, action) => {
      state.isMembersInitializing = action.payload;
    },
    setWorkspace: (state, action) => {
      state.workspace = action.payload;
    },
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setDefaultTemplate: (state, action) => {
      state.defaultTemplate = action.payload;
    },
    setIsDefaultTemplatesInitializing: (state, action) => {
      state.isDefaultTemplatesInitializing = action.payload;
    },
    setTab: (state, action) => {
      state.tab = action.payload;
    },
  },
});

export const {
  setTeam,
  setIsTeamInitializing,
  setIsWorkflowInitializing,
  setWorkflows,
  setMembers,
  setIsMembersInitializing,
  setWorkspace,
  setTemplates,
  setDefaultTemplate,
  setIsDefaultTemplatesInitializing,
  setTab,
} = teamSlice.actions;

export default teamSlice.reducer;
