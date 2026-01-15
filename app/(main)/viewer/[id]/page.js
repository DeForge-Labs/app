"use client";

import ViewerWindow from "@/components/layout/viewer/ViewerWindow";
import ExecuteModal from "@/components/layout/editor/ExecuteModal";
import ViewerNavbar from "@/components/layout/viewer/ViewerNavbar";
import useWorkflowStore from "@/store/useWorkspaceStore";

export default function EditorPage() {
  const { executeModalOpen } = useWorkflowStore();

  return (
    <div className="flex flex-col h-screen dark:bg-dark">
      <ViewerNavbar />
      <div className="flex-1 flex bg-foreground/5 pb-2 px-2 overflow-hidden">
        {executeModalOpen && <ExecuteModal />}
        <div className="flex-1 flex flex-col overflow-hidden rounded-lg border border-foreground/15">
          <ViewerWindow />
        </div>
      </div>
    </div>
  );
}
