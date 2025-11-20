"use client";

import { create } from "zustand";

const initialState = {
  messages: [
    {
      id: "1",
      type: "user",
      content: "Build me a dashboard with a table and charts",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      id: "2",
      type: "assistant",
      content:
        "I'll create a professional dashboard with a responsive table showing user data and interactive charts to visualize metrics. The dashboard will include filters and pagination for better data management.",
      timestamp: new Date(Date.now() - 4 * 60000),
    },
    {
      id: "3",
      type: "user",
      content: "Make the header blue with proper styling",
      timestamp: new Date(Date.now() - 2 * 60000),
    },
    {
      id: "4",
      type: "assistant",
      content:
        "Updated the dashboard header to use a blue color scheme. The changes are applied and the dashboard now features a modern blue header that matches your preference.",
      timestamp: new Date(Date.now() - 1 * 60000),
    },
  ],
  chatModalOpen: true,
  isLoading: false,
  hasMoreMessages: true,
  currentPage: 1,
  totalMessages: 4,
};

const useChatStore = create((set) => ({
  ...initialState,

  // Add new message to the store
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      totalMessages: state.totalMessages + 1,
    })),

  // Prepend older messages when loading more
  prependMessages: (newMessages) =>
    set((state) => ({
      messages: [...newMessages, ...state.messages],
      currentPage: state.currentPage + 1,
    })),

  // Clear all messages
  clearMessages: () =>
    set({
      messages: [],
      currentPage: 1,
      totalMessages: 0,
      hasMoreMessages: false,
    }),

  // Set loading state
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Set chat modal visibility
  setChatModalOpen: (open) => set({ chatModalOpen: open }),

  // Set hasMoreMessages state
  setHasMoreMessages: (hasMore) => set({ hasMoreMessages: hasMore }),
}));

export default useChatStore;
