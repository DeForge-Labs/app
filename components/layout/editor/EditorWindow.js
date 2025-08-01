"use client";

import NodeMenu from "./editorWindow/NodeMenu";
import NodeEditor from "./editorWindow/NodeEditor";
import CustomizerPanel from "./editorWindow/CustomizerPanel";
import { useSelector } from "react-redux";
import ToolPanel from "./ToolPanel";
import DeploymentTab from "./editorWindow/DeploymentTab";
import FormMenu from "./formWindow/FormMenu";
import Canvas from "./formWindow/Canvas";
import SmallEditor from "./formWindow/SmallEditor";
import NodePanel from "./formWindow/NodePanel";

export default function EditorWindow() {
  const paneLeft = useSelector((state) => state.workflow.paneLeft);
  const paneRight = useSelector((state) => state.workflow.paneRight);
  const panel = useSelector((state) => state.workflow.panel);
  const mode = useSelector((state) => state.workflow.mode);
  const isSelector = useSelector((state) => state.form.isSelector);

  return (
    <div className="flex flex-1">
      {paneLeft && (
        <div className="lg:w-80 w-64 border-r bg-black/5 border-black/50 relative overflow-y-auto hide-scroll dark:border-background dark:text-background">
          {mode === "workflow" && <NodeMenu />}
          {mode === "form" && <FormMenu />}
        </div>
      )}

      <div className="flex-1 relative flex flex-col">
        {panel === 1 && mode === "workflow" && <NodeEditor />}
        {panel === 1 && mode === "form" && !isSelector && <Canvas />}
        {panel === 1 && mode === "form" && isSelector && <SmallEditor />}
        {panel === 2 && <DeploymentTab />}

        <ToolPanel />
      </div>

      {paneRight && (
        <div className="lg:w-80 w-64 border-l bg-black/5 border-black/50 relative overflow-y-auto hide-scroll dark:border-background dark:text-background">
          {mode === "workflow" && <CustomizerPanel />}
          {mode === "form" && <NodePanel />}
        </div>
      )}
    </div>
  );
}
