"use client";

import EditorNavbar from "@/components/layout/editor/EditorNavbar";
import EditorWindow from "@/components/layout/editor/EditorWindow";
import ChatModal from "@/components/layout/editor/editorWindow/chat/ChatModal";
import ExecuteModal from "@/components/layout/editor/ExecuteModal";
import useChatStore from "@/store/useChatStore";
import useWorkflowStore from "@/store/useWorkspaceStore";

export default function EditorPage() {
  const { chatModalOpen } = useChatStore();
  const { sidePanel } = useWorkflowStore();
  return (
    <div className="flex flex-col h-screen dark:bg-dark">
      <EditorNavbar />
      <div className="flex-1 flex bg-foreground/5 pb-2 px-2 overflow-hidden">
        {chatModalOpen && sidePanel === "chat" && <ChatModal />}
        {chatModalOpen && sidePanel === "execute" && <ExecuteModal />}
        <div className="flex-1 flex flex-col overflow-hidden rounded-lg border border-foreground/15">
          <EditorWindow />
        </div>
      </div>
    </div>
  );
}
