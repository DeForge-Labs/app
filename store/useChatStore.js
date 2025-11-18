"use client";

import { create } from "zustand";

const initialState = {
  chatModalOpen: true,
};

const useChatStore = create((set) => ({
  ...initialState,

  setChatModalOpen: (open) => {
    set({ chatModalOpen: open });
  },
}));

export default useChatStore;
