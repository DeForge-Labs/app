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
  },
});

export const {
  setTeam,
  setIsTeamInitializing,
  setIsWorkflowInitializing,
  setWorkflows,
  setMembers,
  setIsMembersInitializing,
} = teamSlice.actions;

export default teamSlice.reducer;
