"use client";

import {
  ChevronLeft,
  MessageCircle,
  PanelLeftIcon,
  PanelRightIcon,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WorkflowCard from "../editor/editorNavbar/WorkflowCard";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Skeleton } from "@/components/ui/skeleton";
import useFormStore from "@/store/useFormStore";
import UndoButton from "../editor/editorNavbar/UndoButton";
import { cn } from "@/lib/utils";
import ModeSwitcher from "../editor/editorWindow/nodes/ModeSwitcher";
import { toast } from "sonner";
import ViewerOptionsMenu from "./ViewerOptionsMenu";

export default function ViewerNavbar() {
  const {
    isWorkspaceInitializing,
    hasUnsavedChanges,
    setSidePanel,
    executeModalOpen,
    setExecuteModalOpen,
  } = useWorkspaceStore();
  const { hasUnsavedChanges: hasUnsavedChangesForm } = useFormStore();

  return (
    <header className="sticky top-0 z-50 bg-foreground/5 relative">
      <div className="flex items-center justify-between px-2 h-[50px]">
        <div
          className={cn(
            "flex items-center justify-start gap-1 h-full max-w-[485px] w-full",
            executeModalOpen ? "justify-between" : "",
            (hasUnsavedChanges || hasUnsavedChangesForm) && "max-w-[523px]"
          )}
        >
          <div className="flex items-center gap-1 h-full">
            <Link
              href="/apps"
              className="flex items-center ml-1 justify-center space-x-2"
            >
              <div className="p-1.5 w-fit rounded-sm hover:bg-foreground/5 border border-foreground/20">
                <ChevronLeft className="text-foreground/70 size-3" />
              </div>
            </Link>

            <span className="flex items-center gap-1 dark:text-background">
              {isWorkspaceInitializing ? (
                <Skeleton className="w-40 h-8 rounded-sm" />
              ) : (
                <WorkflowCard />
              )}
            </span>
          </div>

          <div className="flex items-center gap-1 h-full">
            <Button
              size="icon"
              variant="ghost"
              className="text-xs [&_svg:not([class*='size-'])]:size-3 [&_svg:not([class*='size-'])]:opacity-50 border border-foreground/20 bg-card/30 rounded-sm h-[28px] w-7 mr-1"
              onClick={() => setExecuteModalOpen(!executeModalOpen)}
            >
              {executeModalOpen ? <PanelLeftIcon /> : <PanelRightIcon />}
            </Button>

            {isWorkspaceInitializing ? (
              <Skeleton className="w-[86px] h-[30px] rounded-sm" />
            ) : (
              <ModeSwitcher />
            )}

            {(hasUnsavedChanges || hasUnsavedChangesForm) && <UndoButton />}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ViewerOptionsMenu />

          <Button
            className="text-xs gap-1.5 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3 bg-foreground/90"
            onClick={() => {
              if (executeModalOpen) {
                toast.info("Use the execute panel to execute the workflow");
                return;
              }

              setExecuteModalOpen(true);
              setSidePanel("execute");
            }}
          >
            <Play />
            Execute
          </Button>
        </div>
      </div>
    </header>
  );
}
