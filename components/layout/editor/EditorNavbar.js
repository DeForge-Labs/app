"use client";

import {
  setMode,
  setPaneLeft,
  setPaneRight,
} from "@/redux/slice/WorkflowSlice";
import { Button, Tooltip } from "@heroui/react";
import {
  AlertCircleIcon,
  ChevronDown,
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
import { cn } from "@/lib/utils";
import PublishButton from "./editorWindow/PublishButton";

export default function EditorNavbar() {
  const isWorkspaceInitializing = useSelector(
    (state) => state.workflow.isWorkspaceInitializing
  );
  const isFormInitializing = useSelector(
    (state) => state.workflow.isFormInitializing
  );
  const workspace = useSelector((state) => state.workflow.workspace);
  const paneLeft = useSelector((state) => state.workflow.paneLeft);
  const paneRight = useSelector((state) => state.workflow.paneRight);
  const router = useRouter();
  const { loadWorkflowById, loadFormById } = useInitialize();
  const [isUndoing, setIsUndoing] = useState(false);
  const mode = useSelector((state) => state.workflow.mode);
  const workflow = useSelector((state) => state.workflow.workflow);
  const form = useSelector((state) => state.workflow.form);

  const hasUnsavedChanges = useSelector(
    (state) => state.workflow.hasUnsavedChanges
  );

  const hasUnsavedChangesForm = useSelector(
    (state) => state.form.hasUnsavedChanges
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
      if (mode === "workflow") {
        await loadWorkflowById(workflow?.id);
      } else {
        await loadFormById(form?.id);
      }
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
              router.push(`/dashboard/${workspace?.teamId}`);
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
          <div className="inline-block text-sm mt-0.5 dark:text-background">
            {isWorkspaceInitializing ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <div className="flex flex-col gap-1 text-[13px]">
                {workspace?.name}
                <div className="flex items-center gap-1">
                  <div
                    className={`flex items-center gap-1 border border-black/80 text-[10px] w-fit px-2 rounded-md ${cn(
                      workflow?.status === "LIVE"
                        ? "bg-green-500/10 border-green-500 text-green-500"
                        : "bg-red-500/10 border-red-500 text-red-500"
                    )}`}
                  >
                    {workflow?.status === "LIVE" ? (
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    )}
                    {workflow?.status === "LIVE" ? "Production" : "Testing"}
                  </div>

                  {(hasUnsavedChanges || hasUnsavedChangesForm) &&
                    !isWorkspaceInitializing &&
                    workspace?.workflow?.status !== "LIVE" && (
                      <div className="flex items-center gap-1 text-[10px] border border-yellow-400 bg-yellow-400/10 text-yellow-700 dark:text-yellow-400 rounded-md px-2">
                        <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>

                        <span>Unsaved</span>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
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
                !(
                  (hasUnsavedChanges && mode === "workflow") ||
                  (hasUnsavedChangesForm && mode === "form")
                ) ||
                isUndoing ||
                isWorkspaceInitializing ||
                isFormInitializing ||
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
            className="px-4 min-h-9 bg-black/80 dark:bg-background text-background text-sm rounded-md dark:text-dark"
            onPress={() => {
              if (mode === "workflow") {
                dispatch(setMode("form"));
              } else {
                dispatch(setMode("workflow"));
              }
            }}
          >
            <div className="flex items-center gap-2">
              {mode === "form" && hasUnsavedChanges && (
                <div className="h-2 w-2 bg-yellow-400 dark:bg-yellow-500 rounded-full"></div>
              )}
              {mode === "workflow" && hasUnsavedChangesForm && (
                <div className="h-2 w-2 bg-yellow-400 dark:bg-yellow-500 rounded-full"></div>
              )}
              <span>
                {mode === "workflow" ? "Form Editor" : "Workflow Builder"}
              </span>
            </div>
          </Button>

          <div className="flex items-center gap-0.5">
            <PublishButton />
          </div>
        </div>
      </div>
    </header>
  );
}
