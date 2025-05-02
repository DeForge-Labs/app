import { createSlice } from "@reduxjs/toolkit";

import { applyNodeChanges, applyEdgeChanges, addEdge } from "reactflow";
import { getDefaultDataForNodeType } from "@/lib/node-registry";

const workflowSlice = createSlice({
  name: "workflow",

  initialState: {
    workflow: null,
    isWorkflowInitializing: false,
    nodes: null,
    connections: null,
    team: null,
    paneLeft: true,
    paneRight: true,
  },

  reducers: {
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
    setPaneLeft: (state, action) => {
      state.paneLeft = action.payload;
    },
    setPaneRight: (state, action) => {
      state.paneRight = action.payload;
    },
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

      // Get default data for this node type
      const defaultData = data || getDefaultDataForNodeType(type);

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: defaultData,
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
  },
});

export const {
  setWorkflow,
  setIsWorkflowInitializing,
  setNodes,
  setConnections,
  setTeam,
  setSelectedNode,
  onNodesChange,
  onEdgesChange,
  addNode,
  updateNodeData,
  connectNodes,
  deleteNode,
  duplicateNode,
  setPaneLeft,
  setPaneRight,
} = workflowSlice.actions;

export default workflowSlice.reducer;
