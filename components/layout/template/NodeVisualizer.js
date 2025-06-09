"use client";

import { useEffect, useRef, useState } from "react";
import ReactFlow, { Background, Controls, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { useSelector } from "react-redux";
import { GenericNode } from "../editor/editorWindow/GenericNode";

function Flow({ nodes, edges }) {
  const reactFlowWrapper = useRef(null);
  const nodeRegistry = useSelector(
    (state) => state.library?.nodeRegistry || []
  );

  const [nodeTypes, setNodeTypes] = useState({});

  useEffect(() => {
    nodeRegistry.forEach((node) => {
      setNodeTypes((prev) => ({ ...prev, [node.type]: GenericNode }));
    });
  }, [nodeRegistry]);

  return (
    Object.keys(nodeTypes).length > 0 && (
      <div className="h-full w-full relative" ref={reactFlowWrapper}>
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
          <Controls position="top-left" />
        </ReactFlow>
      </div>
    )
  );
}

export default function NodeVisualizer({ nodes, edges }) {
  return (
    <ReactFlowProvider>
      <Flow nodes={nodes} edges={edges} />
    </ReactFlowProvider>
  );
}
