"use client";

import NodeMenu from "./editorWindow/NodeMenu";
import NodeEditor from "./editorWindow/NodeEditor";
import CustomizerPanel from "./editorWindow/CustomizerPanel";
import ToolPanel from "./ToolPanel";
import FormMenu from "./formWindow/FormMenu";
import Canvas from "./formWindow/Canvas";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import FormToolPanel from "./formWindow/FormToolPanel";
import useChatStore from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import LogWindow from "./LogWindow";
import WorkflowLoader from "./editorWindow/chat/WorkflowLoader";

export default function EditorWindow() {
  const {
    showCustomizerPanel,
    mode,
    isWorkflowInitializing,
    isFormInitializing,
  } = useWorkspaceStore();
  const { isLoading, chatMode } = useChatStore();

  return (
    <div className="flex h-full relative">
      {isLoading && chatMode === "build" ? (
        <></>
      ) : (
        <div className="h-full p-2  hide-scroll absolute left-0 top-0">
          {mode === "workflow" && <NodeMenu />}
          {mode === "form" && <FormMenu />}
        </div>
      )}

      <div className="flex-1 relative flex flex-col z-10 bg-background">
        {mode === "workflow" && <NodeEditor />}
        {isLoading && chatMode === "build" ? (
          <></>
        ) : mode === "workflow" && !isWorkflowInitializing ? (
          <ToolPanel />
        ) : (
          <></>
        )}
        {mode === "form" && (
          <div className={cn("ml-0 flex h-full relative")}>
            <Canvas />
            {isLoading && chatMode === "build" ? (
              <></>
            ) : isFormInitializing ? (
              <></>
            ) : (
              <FormToolPanel />
            )}
          </div>
        )}
        {mode === "logs" && (
          <>
            <div className="h-full">
              <LogWindow />
            </div>

            {isLoading && chatMode === "build" ? <></> : <ToolPanel />}
          </>
        )}
      </div>

      {isLoading && chatMode === "build" ? (
        <></>
      ) : showCustomizerPanel && !isWorkflowInitializing ? (
        <div className="h-full p-2 overflow-y-auto hide-scroll absolute right-0">
          {mode === "workflow" && <CustomizerPanel />}
        </div>
      ) : (
        <></>
      )}

      {isLoading && chatMode === "build" ? <WorkflowLoader /> : <></>}
    </div>
  );
}
