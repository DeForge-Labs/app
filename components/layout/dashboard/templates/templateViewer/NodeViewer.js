"use client";

import { useEffect, useState } from "react";
import ReactFlow, { Background, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import ViewerGenericNode from "./ViewerGenericNode";
import { NodeViewerProvider } from "./ViewerContext";

function Flow({ nodes, edges, nodeRegistry, nodeTypes }) {
  return (
    Object.keys(nodeTypes).length > 0 && (
      <div className="h-full w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background />
        </ReactFlow>
      </div>
    )
  );
}

export default function NodeViewer({ nodes, edges, nodeRegistry }) {
  const [nodeTypes, setNodeTypes] = useState({});

  useEffect(() => {
    nodeRegistry.forEach((node) => {
      setNodeTypes((prev) => ({ ...prev, [node.type]: ViewerGenericNode }));
    });
  }, [nodeRegistry]);

  return (
    <NodeViewerProvider nodeRegistry={nodeRegistry}>
      <ReactFlowProvider>
        <Flow
          nodes={nodes}
          edges={edges}
          nodeRegistry={nodeRegistry}
          nodeTypes={nodeTypes}
        />
      </ReactFlowProvider>
    </NodeViewerProvider>
  );
}
