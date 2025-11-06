"use client";

import axios from "axios";
import { create } from "zustand";

const initialState = {
  nodeRegistry: [],
  isLoading: true,
  error: null,
};

const useNodeLibraryStore = create((set) => ({
  ...initialState,

  fetchNodeRegistry: async () => {
    try {
      set({ isLoading: true });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/node/list`
      );

      if (response.data.success) {
        set({ nodeRegistry: response.data.nodes });
      } else {
        set({ error: response.data.message });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set(initialState);
  },
}));

export default useNodeLibraryStore;
