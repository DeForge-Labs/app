"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, { Background, Controls, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedNode } from "@/redux/slice/WorkflowSlice";
import LogoAnimation from "@/components/ui/LogoAnimation";

import { Button } from "@heroui/react";
import { setIsSelector } from "@/redux/slice/formSlice";
import { cn } from "@/lib/utils";
import { MiniNode } from "./smallEditor/MiniNode";

function Flow() {
  const reactFlowWrapper = useRef(null);
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.workflow?.nodes || []);
  const edges = useSelector((state) => state.workflow?.connections || []);
  const nodeRegistry = useSelector(
    (state) => state.library?.nodeRegistry || []
  );

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
      setNodeTypes((prev) => ({ ...prev, [node.type]: MiniNode }));
    });
  }, [nodeRegistry]);

  // Context menu state for edges
  const [edgeContextMenu, setEdgeContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    edgeId: null,
  });

  const onNodeClick = useCallback(
    (_, node) => {
      dispatch(setSelectedNode(node));
      // Hide context menus if they're open
      setNodeContextMenu({ ...nodeContextMenu, visible: false });
      setEdgeContextMenu({ ...edgeContextMenu, visible: false });
    },
    [dispatch, nodeContextMenu, edgeContextMenu]
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
          isValidConnection={() => false}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          fitView
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background />
          <Controls position="top-left" />
        </ReactFlow>
      </div>
    )
  );
}

export default function NodeEditor() {
  const isWorkflowInitializing = useSelector(
    (state) => state.workflow.isWorkflowInitializing
  );
  const dispatch = useDispatch();

  if (isWorkflowInitializing) {
    return <LogoAnimation opacity={0.5} />;
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2 rounded-b-lg border bg-white p-2 px-3 border-black/50 border-t-0 shadow-sm z-10">
        <Button
          onPress={() => {
            dispatch(setIsSelector(false));
          }}
          variant="icon"
          className={cn(
            "w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-4"
          )}
          size="icon"
        >
          Back to Form
        </Button>
      </div>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </>
  );
}
