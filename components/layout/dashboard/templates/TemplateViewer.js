"use client";

import FormViewer from "./templateViewer/FormViewer";
import NodeViewer from "./templateViewer/NodeViewer";
import ViewerNav from "./templateViewer/ViewerNav";
import { useState } from "react";

export default function TemplateViewer({
  defaultView,
  components,
  nodes,
  edges,
  nodeLibrary,
}) {
  const [view, setView] = useState(defaultView);

  return (
    <div className="w-full border flex min-h-[700px] h-[700px] flex-col border-foreground/15 bg-foreground/3 rounded-md relative overflow-hidden">
      <ViewerNav defaultView={defaultView} view={view} setView={setView} />
      <div className="flex-1 w-full bg-background rounded-md rounded-t-none relative overflow-hidden">
        <div className="absolute w-full h-full">
          {view === "form" && components && (
            <FormViewer
              components={components}
              nodes={nodes}
              edges={edges}
              nodeLibrary={nodeLibrary}
            />
          )}

          {view === "workflow" && (
            <NodeViewer
              nodes={nodes}
              edges={edges}
              nodeRegistry={nodeLibrary}
            />
          )}
        </div>
      </div>
    </div>
  );
}
