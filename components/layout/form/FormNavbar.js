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
import ThemeChanger from "../dashboard/ThemeChanger";
import { cn } from "@/lib/utils";
import FormDeployButton from "./FormDeployButton";
import FormRollbackButton from "./FormRollbackButton";
import FormSaveButton from "./FormSaveButton";
import RevertDropdown from "./RevertDropdown";

export default function FormNavbar() {
  const isWorkspaceInitializing = useSelector(
    (state) => state.workflow.isWorkspaceInitializing
  );
  const workspace = useSelector((state) => state.workflow.workspace);
  const workflow = useSelector((state) => state.workflow.workflow);
  const router = useRouter();
  const hasUnsavedChanges = useSelector(
    (state) => state.workflow.hasUnsavedChanges
  );

  return (
    <header className="sticky top-0 z-10 border-b border-black/50 bg-background dark:bg-dark dark:border-background">
      <div className="container flex h-16 items-center justify-between py-4">
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
              </div>
            )}
          </div>
          {!isWorkspaceInitializing && (
            <div className="flex items-center gap-1 mt-0.5">
              <div
                className={`flex items-center gap-1 border border-black/80 text-[10px] w-fit p-1 px-2 rounded-md ${cn(
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
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeChanger />
          {workflow?.status !== "LIVE" && !hasUnsavedChanges && (
            <FormDeployButton
              className={
                "px-4 min-h-9 bg-black/80 dark:bg-background text-background text-sm rounded-md dark:text-dark rounded-r-none"
              }
            />
          )}
          {workflow?.status === "LIVE" && !hasUnsavedChanges && (
            <FormRollbackButton
              className={
                "px-4 min-h-9 bg-black/80 dark:bg-background text-background text-sm rounded-md dark:text-dark rounded-r-none"
              }
            />
          )}

          {hasUnsavedChanges && <FormSaveButton />}

          <RevertDropdown />
        </div>
      </div>
    </header>
  );
}
