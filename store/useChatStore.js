"use client";

import { create } from "zustand";

const initialState = {
  triggerMessage: null,
  messages: [],
  chatModalOpen: true,
  isLoading: false,
  hasMoreMessages: false, // no infinite load in this flow
  currentPage: 1,
  totalMessages: 4,
  workflowJSON: null,
  isChatInitializing: true,
  chatMode: "build",
};

const useChatStore = create((set) => ({
  ...initialState,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      totalMessages: state.totalMessages + 1,
    })),

  setMessages: (messages) =>
    set(() => ({
      messages,
      totalMessages: messages.length,
    })),

  updateMessage: (id, patchOrFn) =>
    set((state) => ({
      messages: state.messages.map((m) => {
        if (m.id !== id) return m;
        if (typeof patchOrFn === "function") {
          return { ...m, ...patchOrFn(m) };
        }
        return { ...m, ...patchOrFn };
      }),
    })),

  replaceMessageId: (oldId, newId) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === oldId ? { ...m, id: newId } : m,
      ),
    })),

  clearMessages: () =>
    set({
      messages: [],
      currentPage: 1,
      totalMessages: 0,
      hasMoreMessages: false,
    }),

  setIsLoading: (loading) => set({ isLoading: loading }),
  setChatModalOpen: (open) => set({ chatModalOpen: open }),
  setHasMoreMessages: (hasMore) => set({ hasMoreMessages: hasMore }),

  setIsChatInitializing: (loading) => set({ isChatInitializing: loading }),
  setWorkflowJSON: (workflow) => set({ workflowJSON: workflow }),
  setChatMode: (mode) => set({ chatMode: mode }),

  setTriggerMessage: (message) => set({ triggerMessage: message }),

  resetChatState: () => {
    const { triggerMessage, ...rest } = initialState;
    set(rest);
  },
}));

export default useChatStore;
