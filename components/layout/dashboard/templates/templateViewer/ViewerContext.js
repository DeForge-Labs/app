"use client";

import { createContext, useContext } from "react";

const NodeViewerContext = createContext(null);

export function NodeViewerProvider({ children, nodeRegistry }) {
  return (
    <NodeViewerContext.Provider value={{ nodeRegistry }}>
      {children}
    </NodeViewerContext.Provider>
  );
}

export function useNodeViewerStore() {
  const context = useContext(NodeViewerContext);

  if (!context) {
    throw new Error(
      "useNodeViewerStore must be used within a NodeViewerProvider"
    );
  }

  return context;
}
