"use client";
import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "reactflow";
import {
  getDefaultDataForNodeType,
  getNodeTypeByType,
} from "@/lib/node-registry";

const deepCloneNodes = (nodes) => {
  return nodes.map((node) => ({
    ...node,
    data: node.data ? { ...node.data } : null,
    position: node.position ? { ...node.position } : null,
  }));
};

const deepCloneConnections = (connections) => {
  return connections.map((edge) => ({ ...edge }));
};

const isObject = (obj) => {
  return obj != null && typeof obj === "object" && !Array.isArray(obj);
};

const areObjectsEqual = (obj1, obj2) => {
  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areObjects = isObject(val1) && isObject(val2);

    if (
      (areObjects && !areObjectsEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
};

const checkForUnsavedChanges = (state) => {
  if (!state.lastSavedState) return true;

  // Check if nodes or connections are null in either state
  if (
    (state.nodes === null && state.lastSavedState.nodes !== null) ||
    (state.nodes !== null && state.lastSavedState.nodes === null) ||
    (state.connections === null && state.lastSavedState.connections !== null) ||
    (state.connections !== null && state.lastSavedState.connections === null)
  ) {
    return true;
  }

  // Compare nodes
  if (state.nodes && state.lastSavedState.nodes) {
    if (state.nodes.length !== state.lastSavedState.nodes.length) {
      return true;
    }

    for (let i = 0; i < state.nodes.length; i++) {
      const currentNode = state.nodes[i];
      const savedNode = state.lastSavedState.nodes.find(
        (n) => n.id === currentNode.id
      );

      if (!savedNode) return true;

      if (currentNode.type !== savedNode.type) return true;

      if (
        currentNode.position.x !== savedNode.position.x ||
        currentNode.position.y !== savedNode.position.y
      ) {
        return true;
      }

      if (!areObjectsEqual(currentNode.data, savedNode.data)) {
        return true;
      }
    }
  }

  // Compare connections
  if (state.connections && state.lastSavedState.connections) {
    if (state.connections.length !== state.lastSavedState.connections.length) {
      return true;
    }

    for (let i = 0; i < state.connections.length; i++) {
      const currentConnection = state.connections[i];
      const savedConnection = state.lastSavedState.connections.find(
        (c) => c.id === currentConnection.id
      );

      if (!savedConnection) return true;

      if (
        currentConnection.source !== savedConnection.source ||
        currentConnection.target !== savedConnection.target ||
        currentConnection.sourceHandle !== savedConnection.sourceHandle ||
        currentConnection.targetHandle !== savedConnection.targetHandle
      ) {
        return true;
      }
    }
  }

  // Compare workflow metadata
  if (state.workflow && state.lastSavedState.workflow) {
    if (
      state.workflow.name !== state.lastSavedState.workflow.name ||
      state.workflow.description !==
        state.lastSavedState.workflow.description ||
      state.workflow.isPublic !== state.lastSavedState.workflow.isPublic
    ) {
      return true;
    }
  } else if (
    (state.workflow && !state.lastSavedState.workflow) ||
    (!state.workflow && state.lastSavedState.workflow)
  ) {
    return true;
  }

  return false;
};

// Initial state
const initialState = {
  workspace: null,
  form: null,
  workflow: null,
  isWorkflowInitializing: true,
  isWorkspaceInitializing: true,
  isFormInitializing: true,
  nodes: [],
  connections: [],
  logs: [],
  newLogs: [],
  isLogInitializing: true,
  team: null,
  selectedNode: null,
  selectedHandle: null,
  selectedNodeId: null,
  hasUnsavedChanges: false,
  lastSavedState: null,
  paneLeft: true,
  paneRight: true,
  workflowEnv: null,
  workflowSocial: null,
  panel: 1,
  mode: "workflow",
  credits: 0,
  plan: "free",
  isStatsInitializing: true,
  showCustomizerPanel: false,
};

const useWorkflowStore = create((set, get) => ({
  ...initialState,

  // Basic setters
  setWorkflowForce: (workflow) => set({ workflow }),

  setWorkflow: ({ workflow, nodes, connections }) =>
    set({
      workflow,
      nodes,
      connections,
      lastSavedState: {
        nodes: nodes ? deepCloneNodes(nodes) : null,
        connections: connections ? deepCloneConnections(connections) : null,
        workflow: workflow ? { ...workflow } : null,
      },
      hasUnsavedChanges: false,
    }),

  setIsWorkflowInitializing: (isWorkflowInitializing) =>
    set({ isWorkflowInitializing }),

  setNodes: (nodes) =>
    set((state) => ({
      nodes,
      hasUnsavedChanges: checkForUnsavedChanges({ ...state, nodes }),
    })),

  setConnections: (connections) =>
    set((state) => ({
      connections,
      hasUnsavedChanges: checkForUnsavedChanges({ ...state, connections }),
    })),

  setTeam: (team) => set({ team }),

  setLogs: (logs) => set({ logs }),

  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs],
    })),

  setIsLogInitializing: (isLogInitializing) => set({ isLogInitializing }),

  setWorkflowSocial: (workflowSocial) => set({ workflowSocial }),

  addNewLog: (log) =>
    set((state) => ({
      newLogs: [log, ...state.newLogs],
    })),

  removeNewLog: (log) =>
    set((state) => ({
      newLogs: state.newLogs.filter((l) => l.id !== log.id),
    })),

  setSelectedHandle: (selectedHandle) => set({ selectedHandle }),

  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),

  setSelectedNode: (selectedNode) => set({ selectedNode }),

  setIsWorkspaceInitializing: (isWorkspaceInitializing) =>
    set({ isWorkspaceInitializing }),

  setIsFormInitializing: (isFormInitializing) => set({ isFormInitializing }),

  setWorkspace: (workspace) => set({ workspace }),

  setForm: (form) => set({ form }),

  setMode: (mode) => set({ mode }),

  setIsStatsInitializing: (isStatsInitializing) => set({ isStatsInitializing }),

  setCredits: (credits) => set({ credits }),

  setPlan: (plan) => set({ plan }),

  setPaneLeft: (paneLeft) => set({ paneLeft }),

  setPaneRight: (paneRight) => set({ paneRight }),

  setWorkflowEnv: (workflowEnv) => set({ workflowEnv }),

  setPanel: (panel) => set({ panel }),

  setShowCustomizerPanel: (showCustomizerPanel) => set({ showCustomizerPanel }),

  // Complex actions
  onNodesChange: (changes) =>
    set((state) => {
      if (!state.nodes) return state;

      const updatedNodes = applyNodeChanges(changes, state.nodes);
      let updatedSelectedNode = state.selectedNode;

      if (state.selectedNode) {
        const node = updatedNodes.find((n) => n.id === state.selectedNode.id);
        if (node) {
          updatedSelectedNode = node;
        }
      }

      const newState = {
        nodes: updatedNodes,
        selectedNode: updatedSelectedNode,
        workflow: state.workflow
          ? { ...state.workflow, updatedAt: new Date().toISOString() }
          : state.workflow,
      };

      return {
        ...newState,
        hasUnsavedChanges: checkForUnsavedChanges({ ...state, ...newState }),
      };
    }),

  onEdgesChange: (changes) =>
    set((state) => {
      if (!state.connections) return state;

      const updatedConnections = applyEdgeChanges(changes, state.connections);

      const newState = {
        connections: updatedConnections,
        workflow: state.workflow
          ? { ...state.workflow, updatedAt: new Date().toISOString() }
          : state.workflow,
      };

      return {
        ...newState,
        hasUnsavedChanges: checkForUnsavedChanges({ ...state, ...newState }),
      };
    }),

  addNode: ({ type, position, data, nodeRegistry }) =>
    set((state) => {
      const nodes = state.nodes || [];

      const nodeType = getNodeTypeByType(type, nodeRegistry);
      const defaultData = getDefaultDataForNodeType(type, nodeRegistry);

      if (nodeType) {
        nodeType.fields.forEach((field) => {
          if (defaultData[field.name] === undefined) {
            defaultData[field.name] = field.value;
          }
        });
      }

      let mergedData = {};

      for (const key in defaultData) {
        const fieldType = nodeType.fields.find(
          (field) => field.name === key
        )?.type;

        if (
          data[key] !== undefined &&
          fieldType !== "CheckBox" &&
          fieldType !== "Slider"
        ) {
          mergedData[key] = data[key];
        } else {
          mergedData[key] = defaultData[key];
        }

        mergedData.category = nodeType.category;
      }

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: mergedData,
      };

      const updatedNodes = [...nodes, newNode];

      const newState = {
        nodes: updatedNodes,
        workflow: state.workflow
          ? { ...state.workflow, updatedAt: new Date().toISOString() }
          : state.workflow,
      };

      return {
        ...newState,
        hasUnsavedChanges: checkForUnsavedChanges({ ...state, ...newState }),
      };
    }),

  updateNodeData: ({ nodeId, newData }) =>
    set((state) => {
      if (!state.nodes) return state;

      const nodeIndex = state.nodes.findIndex((node) => node.id === nodeId);
      if (nodeIndex === -1) return state;

      const updatedNodes = [...state.nodes];
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        data: newData,
      };

      const updatedSelectedNode =
        state.selectedNode && state.selectedNode.id === nodeId
          ? updatedNodes[nodeIndex]
          : state.selectedNode;

      const newState = {
        nodes: updatedNodes,
        selectedNode: updatedSelectedNode,
        workflow: state.workflow
          ? { ...state.workflow, updatedAt: new Date().toISOString() }
          : state.workflow,
      };

      return {
        ...newState,
        hasUnsavedChanges: checkForUnsavedChanges({ ...state, ...newState }),
      };
    }),

  connectNodes: (connection) =>
    set((state) => {
      const connections = state.connections || [];
      const newEdges = addEdge(connection, connections);

      const newState = {
        connections: newEdges,
        workflow: state.workflow
          ? { ...state.workflow, updatedAt: new Date().toISOString() }
          : state.workflow,
      };

      return {
        ...newState,
        hasUnsavedChanges: checkForUnsavedChanges({ ...state, ...newState }),
      };
    }),

  deleteNode: (nodeId) =>
    set((state) => {
      if (!state.nodes || !state.connections) return state;

      const updatedNodes = state.nodes.filter((node) => node.id !== nodeId);
      const updatedConnections = state.connections.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );

      state.showCustomizerPanel = false;

      const updatedSelectedNode =
        state.selectedNode?.id === nodeId ? null : state.selectedNode;

      const newState = {
        nodes: updatedNodes,
        connections: updatedConnections,
        selectedNode: updatedSelectedNode,
        workflow: state.workflow
          ? { ...state.workflow, updatedAt: new Date().toISOString() }
          : state.workflow,
      };

      return {
        ...newState,
        hasUnsavedChanges: checkForUnsavedChanges({ ...state, ...newState }),
      };
    }),

  deleteEdge: (edgeId) =>
    set((state) => {
      if (!state.connections) return state;

      const updatedConnections = state.connections.filter(
        (edge) => edge.id !== edgeId
      );

      const newState = {
        connections: updatedConnections,
        workflow: state.workflow
          ? { ...state.workflow, updatedAt: new Date().toISOString() }
          : state.workflow,
      };

      return {
        ...newState,
        hasUnsavedChanges: checkForUnsavedChanges({ ...state, ...newState }),
      };
    }),

  duplicateNode: (nodeId) =>
    set((state) => {
      if (!state.nodes) return state;

      const nodeToDuplicate = state.nodes.find((node) => node.id === nodeId);
      if (!nodeToDuplicate) return state;

      const position = {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      };

      const newNode = {
        id: `${nodeToDuplicate.type}-${Date.now()}`,
        type: nodeToDuplicate.type,
        position,
        data: { ...nodeToDuplicate.data },
      };

      const updatedNodes = [...state.nodes, newNode];

      const newState = {
        nodes: updatedNodes,
        selectedNode: newNode,
        workflow: state.workflow
          ? { ...state.workflow, updatedAt: new Date().toISOString() }
          : state.workflow,
      };

      return {
        ...newState,
        hasUnsavedChanges: checkForUnsavedChanges({ ...state, ...newState }),
      };
    }),
}));

export default useWorkflowStore;
