"use client";

import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { InputNode } from "./nodes/InputNode";
import { FunctionNode } from "./nodes/FunctionNode";
import { APINode } from "./nodes/APINode";
import { getDefaultDataForNodeType } from "@/lib/node-registry";
import { useDispatch, useSelector } from "react-redux";
import NodeContextMenu from "./NodeContextMenu";
import {
  onNodesChange,
  onEdgesChange,
  setSelectedNode,
  connectNodes,
  deleteNode,
  duplicateNode,
  addNode,
} from "@/redux/slice/WorkflowSlice";

// Define node types registry
const nodeTypes = {
  inputNode: InputNode,
  functionNode: FunctionNode,
  apiNode: APINode,
  // Add more node types as needed
};

function Flow() {
  const reactFlowWrapper = useRef(null);
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.workflow.nodes) || [];
  const edges = useSelector((state) => state.workflow.connections) || [];
  const { project } = useReactFlow();

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null,
  });

  const onConnect = useCallback(
    (connection) => {
      dispatch(connectNodes(connection));
    },
    [dispatch]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      // Get the full node definition if available
      let nodeDefinition = null;
      try {
        const nodeDefString = event.dataTransfer.getData(
          "application/node-definition"
        );
        if (nodeDefString) {
          nodeDefinition = JSON.parse(nodeDefString);
        }
      } catch (error) {
        console.error("Error parsing node definition:", error);
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create default data based on the node definition if available
      let data = {};
      if (nodeDefinition && nodeDefinition.fields) {
        // Extract default values from the node definition
        Object.entries(nodeDefinition.fields).forEach(([key, field]) => {
          data[key] = field.default;
        });
      } else {
        // Fallback to basic defaults if no definition is available
        data = getDefaultDataForNodeType(type);
      }

      dispatch(
        addNode({
          type,
          position,
          data,
        })
      );
    },
    [project, dispatch]
  );

  const onNodeClick = useCallback(
    (_, node) => {
      dispatch(setSelectedNode(node));
      // Hide context menu if it's open
      setContextMenu({ ...contextMenu, visible: false });
    },
    [dispatch, contextMenu]
  );

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent default context menu
      event.preventDefault();

      // Show our custom context menu
      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
      });

      // Set the selected node
      dispatch(setSelectedNode(node));
    },
    [dispatch]
  );

  // Hide context menu when clicking on the canvas
  const onPaneClick = useCallback(() => {
    setContextMenu({ ...contextMenu, visible: false });
  }, [contextMenu]);

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => dispatch(onNodesChange(changes))}
        onEdgesChange={(changes) => dispatch(onEdgesChange(changes))}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {contextMenu.visible && contextMenu.nodeId && (
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onDelete={() => {
            dispatch(deleteNode(contextMenu.nodeId));
            setContextMenu({ ...contextMenu, visible: false });
          }}
          onDuplicate={() => {
            dispatch(duplicateNode(contextMenu.nodeId));
            setContextMenu({ ...contextMenu, visible: false });
          }}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        />
      )}
    </div>
  );
}

export default function NodeEditor() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
