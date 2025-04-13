import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",

  initialState: {
    team: null,
    isTeamInitializing: true,
  },

  reducers: {
    setTeam: (state, action) => {
      state.team = action.payload;
    },
    setIsTeamInitializing: (state, action) => {
      state.isTeamInitializing = action.payload;
    },
  },
});

export const { setTeam, setIsTeamInitializing } = teamSlice.actions;

export default teamSlice.reducer;
