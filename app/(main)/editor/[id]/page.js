"use client";

import ChatModal from "@/components/layout/editor/ChatModal";
import EditorNavbar from "@/components/layout/editor/EditorNavbar";
import EditorWindow from "@/components/layout/editor/EditorWindow";
import ExecuteModal from "@/components/layout/editor/editorWindow/ExecuteModal";
import useChatStore from "@/store/useChatStore";
import useWorkflowStore from "@/store/useWorkspaceStore";

export default function EditorPage() {
  const { chatModalOpen } = useChatStore();
  const { sidePanel } = useWorkflowStore();
  return (
    <div className="flex flex-col h-screen dark:bg-dark">
      <EditorNavbar />
      <div className="flex-1 flex bg-foreground/5 pb-2 px-2">
        {chatModalOpen && sidePanel === "chat" && <ChatModal />}
        {chatModalOpen && sidePanel === "execute" && <ExecuteModal />}
        <div className="flex-1 flex flex-col overflow-hidden rounded-lg border border-foreground/15">
          <EditorWindow />
        </div>
      </div>
    </div>
  );
}
