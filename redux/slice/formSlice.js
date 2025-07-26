import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",

  initialState: {
    components: [],
    selectedComponentId: null,
    hasUnsavedChanges: false,
    lastSavedState: [],
    isPreview: false,
  },

  reducers: {
    addComponent: (state, action) => {
      const newComponent = {
        ...action.payload,
        id: `component-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        order: state.components.length,
      };
      state.components.push(newComponent);
      const isSame = deepCompareComponents(
        state.components,
        state.lastSavedState
      );
      if (isSame) {
        state.hasUnsavedChanges = false;
      } else {
        state.hasUnsavedChanges = true;
      }
    },
    updateComponent: (state, action) => {
      const component = state.components.find(
        (c) => c.id === action.payload.id
      );
      if (component) {
        component.content = action.payload.content;
        if (action.payload.url !== undefined) {
          component.url = action.payload.url;
        }
      }
      const isSame = deepCompareComponents(
        state.components,
        state.lastSavedState
      );
      if (isSame) {
        state.hasUnsavedChanges = false;
      } else {
        state.hasUnsavedChanges = true;
      }
    },
    deleteComponent: (state, action) => {
      state.components = state.components.filter(
        (c) => c.id !== action.payload
      );
      if (state.selectedComponentId === action.payload) {
        state.selectedComponentId = null;
      }
      const isSame = deepCompareComponents(
        state.components,
        state.lastSavedState
      );
      if (isSame) {
        state.hasUnsavedChanges = false;
      } else {
        state.hasUnsavedChanges = true;
      }
    },
    selectComponent: (state, action) => {
      state.selectedComponentId = action.payload;
    },
    reorderComponents: (state, action) => {
      state.components = action.payload.map((component, index) => ({
        ...component,
        order: index,
      }));
      const isSame = deepCompareComponents(
        state.components,
        state.lastSavedState
      );
      if (isSame) {
        state.hasUnsavedChanges = false;
      } else {
        state.hasUnsavedChanges = true;
      }
    },
    clearForm: (state) => {
      state.components = [];
      state.selectedComponentId = null;
      state.hasUnsavedChanges = true;
    },
    loadComponents: (state, action) => {
      state.components = action.payload;
      state.lastSavedState = action.payload;
      state.hasUnsavedChanges = false;
    },
    setIsPreview: (state, action) => {
      state.isPreview = action.payload;
    },
  },
});

// Deep comparison function to check if two component arrays are identical
const deepCompareComponents = (current, saved) => {
  // If lengths are different, they're not equal
  if (current.length !== saved.length) {
    return false;
  }

  // Create maps for O(1) lookup by id
  const currentMap = new Map(current.map((comp) => [comp.id, comp]));
  const savedMap = new Map(saved.map((comp) => [comp.id, comp]));

  // Check if all current components exist in saved and are identical
  for (const currentComp of current) {
    const savedComp = savedMap.get(currentComp.id);

    // If component doesn't exist in saved state, it's different
    if (!savedComp) {
      return false;
    }

    // Compare all possible properties, handling optional keys
    if (
      currentComp.component !== savedComp.component ||
      currentComp.type !== savedComp.type ||
      currentComp.content !== savedComp.content ||
      currentComp.order !== savedComp.order
    ) {
      return false;
    }

    // Handle optional url property - both must have same url state
    const currentUrl = currentComp.url || undefined;
    const savedUrl = savedComp.url || undefined;

    if (currentUrl !== savedUrl) {
      return false;
    }
  }

  // Check if all saved components exist in current (catches deletions)
  for (const savedComp of saved) {
    if (!currentMap.has(savedComp.id)) {
      return false;
    }
  }

  return true;
};

export const {
  addComponent,
  updateComponent,
  deleteComponent,
  selectComponent,
  reorderComponents,
  loadComponents,
  clearForm,
  setIsPreview,
} = formSlice.actions;

export default formSlice.reducer;
