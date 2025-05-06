import { createSlice } from "@reduxjs/toolkit";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "reactflow";
import {
  getDefaultDataForNodeType,
  getNodeTypeByType,
} from "@/lib/node-registry";

const initialState = {
  workflow: null,
  isWorkflowInitializing: false,
  nodes: [], // Changed from null to empty array
  connections: [], // Changed from null to empty array
  team: null,
  selectedNode: null,
  paneLeft: true,
  paneRight: true,
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    // Original actions
    setWorkflow: (state, action) => {
      state.workflow = action.payload;
    },
    setIsWorkflowInitializing: (state, action) => {
      state.isWorkflowInitializing = action.payload;
    },
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setConnections: (state, action) => {
      state.connections = action.payload;
    },
    setTeam: (state, action) => {
      state.team = action.payload;
    },

    // New actions for the node editor
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
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
    },

    onEdgesChange: (state, action) => {
      if (!state.connections) return;

      state.connections = applyEdgeChanges(action.payload, state.connections);

      // Update workflow timestamp
      if (state.workflow) {
        state.workflow.updatedAt = new Date().toISOString();
      }
    },

    addNode: (state, action) => {
      if (!state.nodes) {
        state.nodes = [];
      }

      const { type, position, data } = action.payload;

      // Get the node type definition
      const nodeType = getNodeTypeByType(type);

      // Get default data for this node type
      const defaultData = getDefaultDataForNodeType(type);

      // If we have a node type definition, ensure all field values are set
      if (nodeType) {
        nodeType.fields.forEach((field) => {
          if (defaultData[field.name] === undefined) {
            defaultData[field.name] = field.value;
          }
        });
      }

      // Merge provided data with default data
      const mergedData = data ? { ...defaultData, ...data } : defaultData;

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
    },

    createNewWorkflow: (state, action) => {
      const { name, description } = action.payload;

      state.workflow = {
        id: Date.now().toString(),
        name,
        description: description || "",
        isPublic: false,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.nodes = [];
      state.connections = [];
      state.selectedNode = null;
      state.isWorkflowInitializing = false;
    },

    updateWorkflowMetadata: (state, action) => {
      if (state.workflow) {
        state.workflow = {
          ...state.workflow,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    setPaneLeft: (state, action) => {
      state.paneLeft = action.payload;
    },

    setPaneRight: (state, action) => {
      state.paneRight = action.payload;
    },
  },
});

export const {
  // Original actions
  setWorkflow,
  setIsWorkflowInitializing,
  setNodes,
  setConnections,
  setTeam,

  // New actions
  setSelectedNode,
  onNodesChange,
  onEdgesChange,
  addNode,
  updateNodeData,
  connectNodes,
  deleteNode,
  deleteEdge,
  duplicateNode,
  createNewWorkflow,
  updateWorkflowMetadata,

  setPaneLeft,
  setPaneRight,
} = workflowSlice.actions;

export default workflowSlice.reducer;
