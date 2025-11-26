"use client";

import NodeEditor from "../editor/editorWindow/NodeEditor";
import CustomizerPanel from "../editor/editorWindow/CustomizerPanel";
import ToolPanel from "../editor/ToolPanel";
import ViewerCanvas from "./ViewerCanvas";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import useFormStore from "@/store/useFormStore";
import { cn } from "@/lib/utils";
import LogWindow from "../editor/LogWindow";

export default function ViewerWindow() {
  const {
    showCustomizerPanel,
    mode,
    isWorkflowInitializing,
    isFormInitializing,
  } = useWorkspaceStore();
  const { formModal } = useFormStore();

  return (
    <div className="flex h-full relative">
      <div className="flex-1 relative flex flex-col z-10 bg-background">
        {mode === "workflow" && <NodeEditor />}
        {mode === "workflow" && !isWorkflowInitializing && <ToolPanel />}
        {mode === "form" && (
          <div className={cn("flex h-full relative", formModal && "ml-0")}>
            <ViewerCanvas />
            {!isFormInitializing && <ToolPanel />}
          </div>
        )}
        {mode === "logs" && (
          <>
            <div className="h-full">
              <LogWindow />
            </div>

            <ToolPanel />
          </>
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
