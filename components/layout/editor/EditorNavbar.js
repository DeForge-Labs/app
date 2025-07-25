"use client";

import { setPaneLeft, setPaneRight } from "@/redux/slice/WorkflowSlice";
import { Button, Tooltip } from "@heroui/react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  PanelLeft,
  PanelRight,
  Undo2,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import useInitialize from "@/hooks/useInitialize";
import { useState } from "react";
import { toast } from "sonner";
import ThemeChanger from "../dashboard/ThemeChanger";

export default function EditorNavbar() {
  const isWorkspaceInitializing = useSelector(
    (state) => state.workflow.isWorkspaceInitializing
  );
  const workspace = useSelector((state) => state.workflow.workspace);
  const paneLeft = useSelector((state) => state.workflow.paneLeft);
  const paneRight = useSelector((state) => state.workflow.paneRight);
  const router = useRouter();
  const { loadWorkspaceById } = useInitialize();
  const [isUndoing, setIsUndoing] = useState(false);

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

  const handleUndoClick = async () => {
    try {
      setIsUndoing(true);
      await loadWorkspaceById(workspace?.id);
    } catch (error) {
      console.error("Error loading workspace:", error);
      toast.error("Failed to load workspace");
    } finally {
      setIsUndoing(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-black/50 bg-background dark:bg-dark dark:border-background">
      <div className=" px-5 flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="p-1 mr-2 border border-black/80 rounded-md dark:border-background dark:text-background"
            onPress={() => {
              router.back();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Image
            src="/logo/logo-black.svg"
            alt="Logo"
            width={22}
            height={22}
            className="dark:invert"
          />
          <span className="font-bold inline-block text-2xl dark:text-background">
            Deforge
          </span>
          <ChevronRight size={16} className="mt-1 dark:text-background" />
          <span className="inline-block text-sm mt-0.5 dark:text-background">
            {isWorkspaceInitializing ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              workspace?.name
            )}
          </span>

          {hasUnsavedChanges &&
            !isWorkspaceInitializing &&
            workspace?.workflow?.status !== "LIVE" && (
              <div className="flex items-center gap-2 mt-1 text-xs border border-black/80 rounded-md px-2 py-1 dark:border-background dark:text-background ">
                <div className="h-2 w-2 bg-yellow-400/80 rounded-full"></div>

                <span>Unsaved Changes</span>
              </div>
            )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeChanger />
          <Tooltip
            className="bg-background border-black/50 border shadow-none dark:border-background rounded-md dark:text-background dark:bg-dark"
            content={
              <div className="p-2 text-xs dark:text-background dark:border-background ">
                <p>Revert to last saved version</p>
              </div>
            }
          >
            <Button
              variant="outline"
              size="icon"
              className="px-2 min-h-9 border border-black/80 rounded-md dark:border-background dark:text-background"
              onPress={handleUndoClick}
              isDisabled={
                !hasUnsavedChanges ||
                isUndoing ||
                isWorkspaceInitializing ||
                workspace?.workflow?.status === "LIVE"
              }
            >
              {isUndoing ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Undo2 className="h-4 w-4" />
              )}
            </Button>
          </Tooltip>

          <Button
            variant="outline"
            size="icon"
            className="px-2 min-h-9 border border-black/80 rounded-md dark:border-background dark:text-background"
            onPress={handlePaneLeftClick}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="px-2 min-h-9 border border-black/80 rounded-md dark:border-background dark:text-background"
            onPress={handlePaneRightClick}
          >
            <PanelRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="px-4 min-h-9 border border-black/80 gap-2 text-sm rounded-md dark:border-background dark:text-background"
          >
            <div
              className="h-4 w-4 rounded-full opacity-70"
              style={{
                backgroundColor:
                  workspace?.workflow?.status === "LIVE"
                    ? "#00FF00"
                    : "#FF0000",
              }}
            ></div>
            {workspace?.workflow?.status === "LIVE" ? "Production" : "Testing"}
          </Button>
        </div>
      </div>
    </header>
  );
}
