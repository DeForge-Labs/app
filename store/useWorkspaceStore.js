"use client";

import { create } from "zustand";

const initialState = {
  workspace: null,
  workflow: null,
  nodes: [],
  connections: [],
  isLoading: true,
  team: null,
  form: null,
};

const useWorkspaceStore = create((set) => ({
  ...initialState,

  setWorkspace: (workspace) => set({ workspace }),
  setWorkflow: ({ workflow, nodes, connections }) =>
    set((state) => ({
      ...state,
      workflow,
      nodes,
      connections,
    })),
  setNodes: (nodes) => set({ nodes }),
  setConnections: (connections) => set({ connections }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setTeam: (team) => set({ team }),
  setForm: (form) => set({ form }),
}));

export default useWorkspaceStore;
