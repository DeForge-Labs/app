"use client";

import NodeMenu from "./editorWindow/NodeMenu";
import NodeEditor from "./editorWindow/NodeEditor";
import CustomizerPanel from "./editorWindow/CustomizerPanel";
import ToolPanel from "./ToolPanel";
import DeploymentTab from "./editorWindow/DeploymentTab";
import FormMenu from "./formWindow/FormMenu";
import Canvas from "./formWindow/Canvas";
import SmallEditor from "./formWindow/SmallEditor";
import NodePanel from "./formWindow/NodePanel";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function EditorWindow() {
  const { showCustomizerPanel, mode } = useWorkspaceStore();
  return (
    <div className="flex flex-1 relative">
      <div className="h-full p-2 overflow-y-auto hide-scroll absolute left-0 top-0">
        {mode === "workflow" && <NodeMenu />}
        {mode === "form" && <FormMenu />}
      </div>

      <div className="flex-1 relative flex flex-col z-10">
        {mode === "workflow" && <NodeEditor />}
      </div>

      {showCustomizerPanel && (
        <div className="h-full p-2 overflow-y-auto hide-scroll absolute right-0">
          {mode === "workflow" && <CustomizerPanel />}
        </div>
      )}
    </div>
  );
}
