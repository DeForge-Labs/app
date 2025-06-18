"use client";

import NodeMenu from "./editorWindow/NodeMenu";
import NodeEditor from "./editorWindow/NodeEditor";
import CustomizerPanel from "./editorWindow/CustomizerPanel";
import { useSelector } from "react-redux";
import ToolPanel from "./ToolPanel";
import DeploymentTab from "./editorWindow/DeploymentTab";

export default function EditorWindow() {
  const paneLeft = useSelector((state) => state.workflow.paneLeft);
  const paneRight = useSelector((state) => state.workflow.paneRight);
  const panel = useSelector((state) => state.workflow.panel);

  return (
    <div className="flex flex-1">
      {paneLeft && (
        <div className="lg:w-80 w-64 border-r bg-black/5 border-black/50 relative overflow-y-auto hide-scroll">
          <NodeMenu />
        </div>
      )}

      <div className="flex-1 relative flex flex-col">
        {panel === 1 && <NodeEditor />}
        {panel === 2 && <DeploymentTab />}

        <ToolPanel />
      </div>

      {paneRight && (
        <div className="lg:w-80 w-64 border-l bg-black/5 border-black/50 relative overflow-y-auto hide-scroll">
          <CustomizerPanel />
        </div>
      )}
    </div>
  );
}
