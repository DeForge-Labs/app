"use client";

import NodeMenu from "./editorWindow/NodeMenu";
import NodeEditor from "./editorWindow/NodeEditor";
import CustomizerPanel from "./editorWindow/CustomizerPanel";
import { useSelector } from "react-redux";
import ToolPanel from "./ToolPanel";

export default function EditorWindow() {
  const paneLeft = useSelector((state) => state.workflow.paneLeft);
  const paneRight = useSelector((state) => state.workflow.paneRight);
  const panel = useSelector((state) => state.workflow.panel);

  return (
    <div className="flex flex-1">
      {paneLeft && (
        <div className="w-80 border-r bg-black/5 border-black/50 relative overflow-y-auto hide-scroll">
          <NodeMenu />
        </div>
      )}

      <div className="flex-1 relative">
        {panel === 1 && <NodeEditor />}

        <ToolPanel />
      </div>

      {paneRight && (
        <div className="w-80 border-l bg-black/5 border-black/50 relative overflow-y-auto hide-scroll">
          <CustomizerPanel />
        </div>
      )}
    </div>
  );
}
