import { createSlice } from "@reduxjs/toolkit";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "reactflow";
import {
  getDefaultDataForNodeType,
  getNodeTypeByType,
} from "@/lib/node-registry";

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
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    // Original actions
    setWorkflow: (state, action) => {
      state.workflow = action.payload.workflow;
      state.nodes = action.payload.nodes;
      state.connections = action.payload.connections;
      state.lastSavedState = {
        nodes: state.nodes ? deepCloneNodes(state.nodes) : null,
        connections: state.connections
          ? deepCloneConnections(state.connections)
          : null,
        workflow: state.workflow ? { ...state.workflow } : null,
      };
      state.hasUnsavedChanges = false;
    },
    setIsWorkflowInitializing: (state, action) => {
      state.isWorkflowInitializing = action.payload;
    },
    setNodes: (state, action) => {
      state.nodes = action.payload;
      state.hasUnsavedChanges = checkForUnsavedChanges(state);
    },
    setConnections: (state, action) => {
      state.connections = action.payload;
      state.hasUnsavedChanges = checkForUnsavedChanges(state);
    },
    setTeam: (state, action) => {
      state.team = action.payload;
    },
    setLogs: (state, action) => {
      state.logs = action.payload;
    },
    addLog: (state, action) => {
      state.logs = [action.payload, ...state.logs];
    },
    setIsLogInitializing: (state, action) => {
      state.isLogInitializing = action.payload;
    },

    setWorkflowSocial: (state, action) => {
      state.workflowSocial = action.payload;
    },

    addNewLog: (state, action) => {
      state.newLogs = [action.payload, ...state.newLogs];
    },

    removeNewLog: (state, action) => {
      state.newLogs = state.newLogs.filter(
        (log) => log.id !== action.payload.id
      );
    },

    setSelectedHandle: (state, action) => {
      state.selectedHandle = action.payload;
    },

    setSelectedNodeId: (state, action) => {
      state.selectedNodeId = action.payload;
    },

    // New actions for the node editor
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    },

    setIsWorkspaceInitializing: (state, action) => {
      state.isWorkspaceInitializing = action.payload;
    },

    setIsFormInitializing: (state, action) => {
      state.isFormInitializing = action.payload;
    },

    setWorkspace: (state, action) => {
      state.workspace = action.payload;
    },

    setForm: (state, action) => {
      state.form = action.payload;
    },

    setMode: (state, action) => {
      state.mode = action.payload;
    },

    onNodesChange: (state, action) => {
      if (!state.nodes) return;

      state.nodes = applyNodeChanges(action.payload, state.nodes);

      // Update selectedNode if it was changed
      if (state.selectedNode) {
        const updatedNode = state.nodes.find(
          (n) => n.id === state.selectedNode.id
        );
        if (updatedNode) {
          state.selectedNode = updatedNode;
        }
      }

      // Update workflow timestamp
      if (state.workflow) {
        state.workflow.updatedAt = new Date().toISOString();
      }

      state.hasUnsavedChanges = checkForUnsavedChanges(state);
    },

    onEdgesChange: (state, action) => {
      if (!state.connections) return;

      state.connections = applyEdgeChanges(action.payload, state.connections);

      // Update workflow timestamp
      if (state.workflow) {
        state.workflow.updatedAt = new Date().toISOString();
      }

      state.hasUnsavedChanges = checkForUnsavedChanges(state);
    },

    addNode: (state, action) => {
      if (!state.nodes) {
        state.nodes = [];
      }

      const { type, position, data, nodeRegistry } = action.payload;

      // Get the node type definition
      const nodeType = getNodeTypeByType(type, nodeRegistry);

      // Get default data for this node type
      const defaultData = getDefaultDataForNodeType(type, nodeRegistry);

      // If we have a node type definition, ensure all field values are set
      if (nodeType) {
        nodeType.fields.forEach((field) => {
          if (defaultData[field.name] === undefined) {
            defaultData[field.name] = field.value;
          }
        });
      }

      // Merge provided data with default data
      const mergedData = data
        ? { ...defaultData, ...data, category: nodeType.category }
        : defaultData;

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: mergedData,
      };

      state.nodes.push(newNode);

      // Update workflow timestamp
      if (state.workflow) {
        state.workflow.updatedAt = new Date().toISOString();
      }

      state.hasUnsavedChanges = checkForUnsavedChanges(state);
    },

    updateNodeData: (state, action) => {
      if (!state.nodes) return;

      const { nodeId, newData } = action.payload;

      const nodeIndex = state.nodes.findIndex((node) => node.id === nodeId);
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex] = {
          ...state.nodes[nodeIndex],
          data: newData,
        };

        // Update selectedNode if it was the one that changed
        if (state.selectedNode && state.selectedNode.id === nodeId) {
          state.selectedNode = state.nodes[nodeIndex];
        }

        // Update workflow timestamp
        if (state.workflow) {
          state.workflow.updatedAt = new Date().toISOString();
        }
      }

      state.hasUnsavedChanges = checkForUnsavedChanges(state);
    },

    connectNodes: (state, action) => {
      if (!state.connections) {
        state.connections = [];
      }

      const connection = action.payload;
      const newEdges = addEdge(connection, state.connections);
      state.connections = newEdges;

      // Update workflow timestamp
      if (state.workflow) {
        state.workflow.updatedAt = new Date().toISOString();
      }

      state.hasUnsavedChanges = checkForUnsavedChanges(state);
    },

    deleteNode: (state, action) => {
      if (!state.nodes || !state.connections) return;

      const nodeId = action.payload;

      // Delete the node
      state.nodes = state.nodes.filter((node) => node.id !== nodeId);

      // Delete any connected edges
      state.connections = state.connections.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );

      // Clear selected node if it was the deleted one
      if (state.selectedNode?.id === nodeId) {
        state.selectedNode = null;
      }

      // Update workflow timestamp
      if (state.workflow) {
        state.workflow.updatedAt = new Date().toISOString();
      }

      state.hasUnsavedChanges = checkForUnsavedChanges(state);
    },

    // New action to delete an edge
    deleteEdge: (state, action) => {
      if (!state.connections) return;

      const edgeId = action.payload;

      // Delete the edge
      state.connections = state.connections.filter(
        (edge) => edge.id !== edgeId
      );

      // Update workflow timestamp
      if (state.workflow) {
        state.workflow.updatedAt = new Date().toISOString();
      }

      state.hasUnsavedChanges = checkForUnsavedChanges(state);
    },

    duplicateNode: (state, action) => {
      if (!state.nodes) return;

      const nodeId = action.payload;
      const nodeToDuplicate = state.nodes.find((node) => node.id === nodeId);

      if (!nodeToDuplicate) return;

      // Create a new position slightly offset from the original
      const position = {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      };

      // Create a new node with the same type and data but a new ID
      const newNode = {
        id: `${nodeToDuplicate.type}-${Date.now()}`,
        type: nodeToDuplicate.type,
        position,
        data: { ...nodeToDuplicate.data },
      };

      state.nodes.push(newNode);
      state.selectedNode = newNode;

      // Update workflow timestamp
      if (state.workflow) {
        state.workflow.updatedAt = new Date().toISOString();
      }

      state.hasUnsavedChanges = checkForUnsavedChanges(state);
    },

    setPaneLeft: (state, action) => {
      state.paneLeft = action.payload;
    },

    setPaneRight: (state, action) => {
      state.paneRight = action.payload;
    },

    setWorkflowEnv: (state, action) => {
      state.workflowEnv = action.payload;
    },

    setPanel: (state, action) => {
      state.panel = action.payload;
    },
  },
});

// Helper function to deep clone nodes
function deepCloneNodes(nodes) {
  return nodes.map((node) => ({
    ...node,
    data: node.data ? { ...node.data } : null,
    position: node.position ? { ...node.position } : null,
  }));
}

// Helper function to deep clone connections
function deepCloneConnections(connections) {
  return connections.map((edge) => ({ ...edge }));
}

// Helper function to check if there are unsaved changes
function checkForUnsavedChanges(state) {
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
    // Check if the number of nodes has changed
    if (state.nodes.length !== state.lastSavedState.nodes.length) {
      return true;
    }

    // Check each node for changes
    for (let i = 0; i < state.nodes.length; i++) {
      const currentNode = state.nodes[i];

      // Find the corresponding node in the saved state
      const savedNode = state.lastSavedState.nodes.find(
        (n) => n.id === currentNode.id
      );

      // If the node doesn't exist in the saved state, there are unsaved changes
      if (!savedNode) {
        return true;
      }

      // Check if the node type has changed
      if (currentNode.type !== savedNode.type) {
        return true;
      }

      // Check if the node position has changed
      if (
        currentNode.position.x !== savedNode.position.x ||
        currentNode.position.y !== savedNode.position.y
      ) {
        return true;
      }

      // Check if the node data has changed
      if (!areObjectsEqual(currentNode.data, savedNode.data)) {
        return true;
      }
    }
  }

  // Compare connections
  if (state.connections && state.lastSavedState.connections) {
    // Check if the number of connections has changed
    if (state.connections.length !== state.lastSavedState.connections.length) {
      return true;
    }

    // Check each connection for changes
    for (let i = 0; i < state.connections.length; i++) {
      const currentConnection = state.connections[i];

      // Find the corresponding connection in the saved state
      const savedConnection = state.lastSavedState.connections.find(
        (c) => c.id === currentConnection.id
      );

      // If the connection doesn't exist in the saved state, there are unsaved changes
      if (!savedConnection) {
        return true;
      }

      // Check if the connection properties have changed
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

  // If we've made it this far, there are no unsaved changes
  return false;
}

// Helper function to compare objects deeply
function areObjectsEqual(obj1, obj2) {
  // If either object is null or undefined, check if they're both the same
  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // If the number of keys is different, the objects are not equal
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check each key in obj1
  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    // Check if the values are objects
    const areObjects = isObject(val1) && isObject(val2);

    // If both values are objects, recursively compare them
    // Otherwise, compare the values directly
    if (
      (areObjects && !areObjectsEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

// Helper function to check if a value is an object
function isObject(obj) {
  return obj != null && typeof obj === "object" && !Array.isArray(obj);
}

export const {
  // Original actions
  setWorkflow,
  setIsWorkflowInitializing,
  setNodes,
  setConnections,
  setTeam,
  setLogs,
  addLog,
  setIsLogInitializing,
  addNewLog,
  removeNewLog,
  setWorkflowSocial,

  // New actions
  setSelectedNode,
  setSelectedHandle,
  setSelectedNodeId,
  onNodesChange,
  onEdgesChange,
  addNode,
  updateNodeData,
  connectNodes,
  deleteNode,
  deleteEdge,
  duplicateNode,
  setPanel,
  setIsWorkspaceInitializing,
  setIsFormInitializing,
  setWorkspace,
  setForm,
  setPaneLeft,
  setPaneRight,
  setWorkflowEnv,
  setMode,
} = workflowSlice.actions;

export default workflowSlice.reducer;
