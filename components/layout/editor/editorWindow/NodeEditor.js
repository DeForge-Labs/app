"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  onNodesChange,
  onEdgesChange,
  setSelectedNode,
  addNode,
  connectNodes,
  deleteNode,
  duplicateNode,
  deleteEdge,
  setSelectedHandle,
  setSelectedNodeId,
} from "@/redux/slice/WorkflowSlice";
import { getNodeTypeByType } from "@/lib/node-registry";
import NodeContextMenu from "./NodeContextMenu";
import EdgeContextMenu from "./EdgeContextMenu";
import { GenericNode } from "./GenericNode";
import LogoAnimation from "@/components/ui/LogoAnimation";
import { toast } from "sonner";

function Flow() {
  const reactFlowWrapper = useRef(null);
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.workflow?.nodes || []);
  const edges = useSelector((state) => state.workflow?.connections || []);
  const nodeRegistry = useSelector(
    (state) => state.library?.nodeRegistry || []
  );
  const workflow = useSelector((state) => state.workflow?.workflow || null);

  const { project } = useReactFlow();

  // Context menu state for nodes
  const [nodeContextMenu, setNodeContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null,
  });

  const [nodeTypes, setNodeTypes] = useState({});

  useEffect(() => {
    nodeRegistry.forEach((node) => {
      setNodeTypes((prev) => ({ ...prev, [node.type]: GenericNode }));
    });
  }, [nodeRegistry]);

  // Context menu state for edges
  const [edgeContextMenu, setEdgeContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    edgeId: null,
  });

  // Move isValidConnection inside the component to access latest edges
  const isValidConnection = useCallback(
    (connection) => {
      if (workflow?.status === "LIVE") {
        return false;
      }

      // Get source and target nodes
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (connection.source === connection.target) {
        return false;
      }

      if (!sourceNode || !targetNode) return false;

      // Get node type definitions
      const sourceNodeType = getNodeTypeByType(sourceNode.type, nodeRegistry);
      const targetNodeType = getNodeTypeByType(targetNode.type, nodeRegistry);

      if (!sourceNodeType || !targetNodeType) return false;

      // Extract output and input types from the handle IDs
      const sourceHandleParts = connection.sourceHandle?.split("-") || [];
      const targetHandleParts = connection.targetHandle?.split("-") || [];

      if (sourceHandleParts.length < 3 || targetHandleParts.length < 3)
        return false;

      // Get the output and input types
      // Format is "output-name-type" or "input-name-type"
      const outputType = sourceHandleParts[sourceHandleParts.length - 1];
      const inputType = targetHandleParts[targetHandleParts.length - 1];

      const isArrayInput = inputType.endsWith("[]");

      // Check if the target handle already has a connection - now using latest edges
      const targetHandleAlreadyConnected = edges.some(
        (edge) =>
          edge.target === connection.target &&
          edge.targetHandle === connection.targetHandle
      );

      if (targetHandleAlreadyConnected && !isArrayInput) {
        return false;
      }

      // Check if types are compatible
      // For now, we'll consider exact matches and 'any' type as compatible
      if (isArrayInput) {
        // For array inputs, check if the output type matches the array element type
        const arrayElementType = inputType.slice(0, -2); // Remove the [] suffix
        return (
          outputType === arrayElementType ||
          outputType === "Any" ||
          arrayElementType === "Any"
        );
      } else {
        // For non-array inputs, check exact match or 'any' type
        return (
          outputType === inputType ||
          outputType === "Any" ||
          inputType === "Any"
        );
      }
    },
    [edges, nodes, nodeRegistry, workflow]
  );

  const onConnect = useCallback(
    (connection) => {
      // Validate connection before adding it
      if (isValidConnection(connection)) {
        dispatch(connectNodes(connection));
      } else {
        console.warn("Invalid connection: types do not match");
        // Optionally show a notification to the user
      }
    },
    [dispatch, isValidConnection]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onConnectStart = useCallback((event, connection) => {
    dispatch(setSelectedHandle(connection.handleId));
    dispatch(setSelectedNodeId(connection.nodeId));
  }, []);

  const onConnectEnd = useCallback((event) => {
    dispatch(setSelectedHandle(null));
    dispatch(setSelectedNodeId(null));
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (workflow?.status === "LIVE") {
        toast.error("Workflow is live. You cannot add nodes.");
        return;
      }

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

      // Extract default values from the node definition
      data = { label: nodeDefinition.title };

      nodeDefinition.fields.forEach((field) => {
        if (field.type === "select") {
          data[field.name] = field.value;
        } else {
          data[field.name] = null;
        }
      });

      const nodeCategory = event.dataTransfer.getData(
        "application/node-category"
      );

      const isTriggerPresent = nodes.some(
        (node) => node.data.category === "trigger"
      );

      if (isTriggerPresent) {
        const isCurrentNodeTrigger = nodeCategory === "trigger";

        if (isCurrentNodeTrigger) {
          toast.error("Only one trigger node is allowed");
          return;
        }
      }

      dispatch(
        addNode({
          type,
          position,
          data,
          nodeRegistry,
        })
      );
    },
    [project, dispatch, workflow]
  );

  const onNodeClick = useCallback(
    (_, node) => {
      dispatch(setSelectedNode(node));
      // Hide context menus if they're open
      setNodeContextMenu({ ...nodeContextMenu, visible: false });
      setEdgeContextMenu({ ...edgeContextMenu, visible: false });
    },
    [dispatch, nodeContextMenu, edgeContextMenu]
  );

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent default context menu
      event.preventDefault();

      if (workflow?.status === "LIVE") {
        return;
      }

      const containerRect =
        reactFlowWrapper.current?.getBoundingClientRect() || {
          left: 0,
          top: 0,
        };

      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;

      // Show our custom context menu
      setNodeContextMenu({
        visible: true,
        x,
        y,
        nodeId: node.id,
      });

      // Hide edge context menu if it's open
      setEdgeContextMenu({ ...edgeContextMenu, visible: false });

      // Set the selected node
      dispatch(setSelectedNode(node));
    },
    [dispatch, edgeContextMenu, workflow]
  );

  const onEdgeContextMenu = useCallback(
    (event, edge) => {
      // Prevent default context menu
      event.preventDefault();

      if (workflow?.status === "LIVE") {
        return;
      }

      const containerRect =
        reactFlowWrapper.current?.getBoundingClientRect() || {
          left: 0,
          top: 0,
        };

      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;

      // Show our custom context menu
      setEdgeContextMenu({
        visible: true,
        x,
        y,
        edgeId: edge.id,
      });

      // Hide node context menu if it's open
      setNodeContextMenu({ ...nodeContextMenu, visible: false });
    },
    [nodeContextMenu, workflow]
  );

  // Hide context menus when clicking on the canvas
  const onPaneClick = useCallback(() => {
    setNodeContextMenu({ ...nodeContextMenu, visible: false });
    setEdgeContextMenu({ ...edgeContextMenu, visible: false });
  }, [nodeContextMenu, edgeContextMenu]);

  return (
    Object.keys(nodeTypes).length > 0 && (
      <div className="h-full w-full relative" ref={reactFlowWrapper}>
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
          onEdgeContextMenu={onEdgeContextMenu}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          nodesDraggable={workflow?.status !== "LIVE"}
          nodesConnectable={workflow?.status !== "LIVE"}
          fitView
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background />
          <Controls position="top-left" />
        </ReactFlow>

        {nodeContextMenu.visible && nodeContextMenu.nodeId && (
          <NodeContextMenu
            x={nodeContextMenu.x}
            y={nodeContextMenu.y}
            nodeId={nodeContextMenu.nodeId}
            onDelete={() => {
              dispatch(deleteNode(nodeContextMenu.nodeId));
              setNodeContextMenu({ ...nodeContextMenu, visible: false });
            }}
            onDuplicate={() => {
              dispatch(duplicateNode(nodeContextMenu.nodeId));
              setNodeContextMenu({ ...nodeContextMenu, visible: false });
            }}
            onClose={() =>
              setNodeContextMenu({ ...nodeContextMenu, visible: false })
            }
          />
        )}

        {edgeContextMenu.visible && edgeContextMenu.edgeId && (
          <EdgeContextMenu
            x={edgeContextMenu.x}
            y={edgeContextMenu.y}
            edgeId={edgeContextMenu.edgeId}
            onDelete={() => {
              dispatch(deleteEdge(edgeContextMenu.edgeId));
              setEdgeContextMenu({ ...edgeContextMenu, visible: false });
            }}
            onClose={() =>
              setEdgeContextMenu({ ...edgeContextMenu, visible: false })
            }
          />
        )}
      </div>
    )
  );
}

export default function NodeEditor() {
  const isWorkflowInitializing = useSelector(
    (state) => state.workflow.isWorkflowInitializing
  );

  if (isWorkflowInitializing) {
    return <LogoAnimation opacity={0.5} />;
  }

  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
