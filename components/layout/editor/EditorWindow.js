"use client";

import NodeMenu from "./editorWindow/NodeMenu";
import NodeEditor from "./editorWindow/NodeEditor";
import CustomizerPanel from "./editorWindow/CustomizerPanel";
import ToolPanel from "./ToolPanel";
import FormMenu from "./formWindow/FormMenu";
import Canvas from "./formWindow/Canvas";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import FormToolPanel from "./formWindow/FormToolPanel";
import useFormStore from "@/store/useFormStore";
import { cn } from "@/lib/utils";

export default function EditorWindow() {
  const {
    showCustomizerPanel,
    mode,
    isWorkflowInitializing,
    isFormInitializing,
  } = useWorkspaceStore();
  const { formModal } = useFormStore();

  return (
    <div className="flex flex-1 relative">
      <div className="h-full p-2 overflow-y-auto hide-scroll absolute left-0 top-0">
        {mode === "workflow" && <NodeMenu />}
        {mode === "form" && <FormMenu />}
      </div>

      <div className="flex-1 relative flex flex-col z-10 bg-background">
        {mode === "workflow" && <NodeEditor />}
        {mode === "workflow" && !isWorkflowInitializing && <ToolPanel />}
        {mode === "form" && (
          <div
            className={cn("ml-84 flex h-full relative", formModal && "ml-0")}
          >
            <Canvas />
            {!isFormInitializing && <FormToolPanel />}
          </div>
        )}
      </div>

      {showCustomizerPanel && !isWorkflowInitializing && (
        <div className="h-full p-2 overflow-y-auto hide-scroll absolute right-0">
          {mode === "workflow" && <CustomizerPanel />}
        </div>
      )}
    </div>
  );
}
