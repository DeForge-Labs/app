"use client";

import ViewerWindow from "@/components/layout/viewer/ViewerWindow";
import ExecuteModal from "@/components/layout/editor/ExecuteModal";
import ViewerNavbar from "@/components/layout/viewer/ViewerNavbar";
import useWorkflowStore from "@/store/useWorkspaceStore";
import ChatModal from "@/components/layout/editor/editorWindow/chat/ChatModal";
import { AnimatePresence, motion } from "framer-motion";
import useChatStore from "@/store/useChatStore";
import EditorSidePanel from "@/components/layout/editor/EditorSidePanel";

const panelVariants = {
  initial: { x: -20, opacity: 0, width: 0 },
  animate: { x: 0, opacity: 1, width: "auto" },
  exit: { x: -20, opacity: 0, width: 0 },
};

export default function EditorPage() {
  const { sidePanel } = useWorkflowStore();
  const { chatModalOpen } = useChatStore();

  return (
    <div className="flex flex-col h-screen dark:bg-dark">
      <ViewerNavbar />
      <div className="flex-1 flex bg-foreground/5 pb-2 px-2 overflow-hidden">
        <EditorSidePanel />
        <AnimatePresence mode="wait">
          {chatModalOpen && sidePanel === "chat" && (
            <motion.div
              key="side-panel"
              {...panelVariants}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="h-full flex-shrink-0"
            >
              <ChatModal />
            </motion.div>
          )}

          {chatModalOpen && sidePanel === "execute" && (
            <motion.div
              key="side-panel"
              {...panelVariants}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="h-full flex-shrink-0"
            >
              <ExecuteModal />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex-1 flex flex-col overflow-hidden rounded-lg border border-foreground/15">
          <ViewerWindow />
        </div>
      </div>
    </div>
  );
}
