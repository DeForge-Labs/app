"use client";

import { setPaneLeft, setPaneRight } from "@/redux/slice/WorkflowSlice";
import { Button } from "@heroui/react";
import {
  ChevronLeft,
  ChevronRight,
  GitBranchPlus,
  Loader2,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import SaveButton from "./editorWindow/navbar/SaveButton";
import { useRouter } from "next/navigation";

export default function EditorNavbar() {
  const isWorkflowInitializing = useSelector(
    (state) => state.workflow.isWorkflowInitializing
  );
  const workflow = useSelector((state) => state.workflow.workflow);
  const paneLeft = useSelector((state) => state.workflow.paneLeft);
  const paneRight = useSelector((state) => state.workflow.paneRight);
  const router = useRouter();

  const hasUnsavedChanges = useSelector(
    (state) => state.workflow.hasUnsavedChanges
  );

  const dispatch = useDispatch();

  const handlePaneLeftClick = () => {
    dispatch(setPaneLeft(!paneLeft));
  };

  const handlePaneRightClick = () => {
    dispatch(setPaneRight(!paneRight));
  };

  return (
    <header className="sticky top-0 z-10 border-b border-black/50 bg-background">
      <div className=" px-5 flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="p-1 mr-2 border border-black/80 rounded-lg"
            onPress={() => {
              router.back();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Image src="/logo/logo-black.svg" alt="Logo" width={22} height={22} />
          <span className="font-bold inline-block text-2xl">Deforge</span>
          <ChevronRight size={16} className="mt-1" />
          <span className="inline-block text-sm mt-0.5">
            {isWorkflowInitializing ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              workflow?.name
            )}
          </span>

          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 mt-1 text-xs border border-black/80 rounded-lg px-2 py-1 ">
              <div className="h-2 w-2 bg-yellow-400/80 rounded-full"></div>

              <span>Unsaved Changes</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="px-2 min-h-9 border border-black/80 rounded-lg"
            onPress={handlePaneLeftClick}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="px-2 min-h-9 border border-black/80 rounded-lg"
            onPress={handlePaneRightClick}
          >
            <PanelRight className="h-4 w-4" />
          </Button>

          <SaveButton />

          <Button
            variant="outline"
            size="icon"
            className="px-4 min-h-9 bg-black/80 text-background rounded-lg flex items-center gap-2 text-sm"
          >
            <GitBranchPlus className="h-4 w-4" /> Deploy Flow
          </Button>
        </div>
      </div>
    </header>
  );
}
