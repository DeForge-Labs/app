"use client";
import { create } from "zustand";

// Deep comparison function to check if two component arrays are identical
const deepCompareComponents = (current, saved) => {
  if (current.length !== saved.length) {
    return false;
  }

  const currentMap = new Map(current.map((comp) => [comp.id, comp]));
  const savedMap = new Map(saved.map((comp) => [comp.id, comp]));

  for (const currentComp of current) {
    const savedComp = savedMap.get(currentComp.id);

    if (!savedComp) {
      return false;
    }

    if (
      currentComp.component !== savedComp.component ||
      currentComp.type !== savedComp.type ||
      currentComp.content !== savedComp.content ||
      currentComp.order !== savedComp.order
    ) {
      return false;
    }

    const currentUrl = currentComp.url || undefined;
    const savedUrl = savedComp.url || undefined;

    if (currentUrl !== savedUrl) {
      return false;
    }
  }

  for (const savedComp of saved) {
    if (!currentMap.has(savedComp.id)) {
      return false;
    }
  }

  return true;
};

const initialState = {
  components: [],
  selectedComponentId: null,
  hasUnsavedChanges: false,
  lastSavedState: [],
  isPreview: false,
  formModal: false,
};

const useFormStore = create((set) => ({
  ...initialState,

  addComponent: (payload) =>
    set((state) => {
      let newComponent;

      if (payload.component === "component") {
        newComponent = {
          ...payload,
          order: state.components.length,
        };
      } else {
        newComponent = {
          ...payload,
          id: `component-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          order: state.components.length,
        };
      }

      const updatedComponents = [...state.components, newComponent];
      const isSame = deepCompareComponents(
        updatedComponents,
        state.lastSavedState
      );

      return {
        components: updatedComponents,
        hasUnsavedChanges: !isSame,
      };
    }),

  updateComponent: (payload) =>
    set((state) => {
      const updatedComponents = state.components.map((c) => {
        if (c.id === payload.id) {
          const updated = { ...c, content: payload.content };
          if (payload.url !== undefined) {
            updated.url = payload.url;
          }
          return updated;
        }
        return c;
      });

      const isSame = deepCompareComponents(
        updatedComponents,
        state.lastSavedState
      );

      return {
        components: updatedComponents,
        hasUnsavedChanges: !isSame,
      };
    }),

  deleteComponent: (id) =>
    set((state) => {
      const updatedComponents = state.components.filter((c) => c.id !== id);
      const isSame = deepCompareComponents(
        updatedComponents,
        state.lastSavedState
      );

      return {
        components: updatedComponents,
        selectedComponentId:
          state.selectedComponentId === id ? null : state.selectedComponentId,
        hasUnsavedChanges: !isSame,
      };
    }),

  selectComponent: (id) =>
    set({
      selectedComponentId: id,
    }),

  reorderComponents: (components) =>
    set((state) => {
      const updatedComponents = components.map((component, index) => ({
        ...component,
        order: index,
      }));

      const isSame = deepCompareComponents(
        updatedComponents,
        state.lastSavedState
      );

      return {
        components: updatedComponents,
        hasUnsavedChanges: !isSame,
      };
    }),

  clearForm: () =>
    set({
      components: [],
      selectedComponentId: null,
      hasUnsavedChanges: true,
    }),

  loadComponents: (components) =>
    set({
      components,
      lastSavedState: components,
      hasUnsavedChanges: false,
    }),

  setComponents: (components) =>
    set((state) => {
      const updatedComponents = components.map((component, index) => ({
        ...component,
        order: index,
      }));

      const isSame = deepCompareComponents(updatedComponents, state.components);

      return {
        components: updatedComponents,
        hasUnsavedChanges: !isSame,
      };
    }),

  setIsPreview: (isPreview) =>
    set({
      isPreview,
    }),

  setFormModal: (formModal) =>
    set({
      formModal,
    }),

  resetFormState: () => set(initialState),
}));

export default useFormStore;
