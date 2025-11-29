"use client";

import EditorNavbar from "@/components/layout/editor/EditorNavbar";
import EditorSidePanel from "@/components/layout/editor/EditorSidePanel";
import EditorWindow from "@/components/layout/editor/EditorWindow";
import ChatModal from "@/components/layout/editor/editorWindow/chat/ChatModal";
import ExecuteModal from "@/components/layout/editor/ExecuteModal";
import useChatStore from "@/store/useChatStore";
import useWorkflowStore from "@/store/useWorkspaceStore";
import { AnimatePresence, motion } from "framer-motion"; // 1. Import Framer Motion

export default function EditorPage() {
  const { chatModalOpen } = useChatStore();
  const { sidePanel } = useWorkflowStore();

  // Define animation settings for consistency
  const panelVariants = {
    initial: { x: -20, opacity: 0, width: 0 },
    animate: { x: 0, opacity: 1, width: "auto" },
    exit: { x: -20, opacity: 0, width: 0 },
  };

  return (
    <div className="flex flex-col h-screen dark:bg-dark">
      <EditorNavbar />
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
          <EditorWindow />
        </div>
      </div>
    </div>
  );
}
