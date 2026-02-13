"use client";

import { ChevronLeft, Play } from "lucide-react";
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
import useChatStore from "@/store/useChatStore";

export default function ViewerNavbar() {
  const {
    isWorkspaceInitializing,
    hasUnsavedChanges,
    setSidePanel,
    sidePanel,
  } = useWorkspaceStore();
  const { chatModalOpen, setChatModalOpen } = useChatStore();
  const { hasUnsavedChanges: hasUnsavedChangesForm } = useFormStore();

  return (
    <header className="sticky top-0 z-50 bg-foreground/5 relative">
      <div className="flex items-center justify-between px-2 h-[50px]">
        <div
          className={cn(
            "flex items-center justify-start gap-1 h-full max-w-[530px] w-full",
            chatModalOpen ? "justify-between" : "",
            (hasUnsavedChanges || hasUnsavedChangesForm) && "max-w-[568px]",
          )}
        >
          <div className="flex items-center gap-1 h-full">
            <Link href="/apps">
              <Button
                variant="outline"
                className={
                  "w-8 ml-1 rounded-sm dark:not-disabled:not-active:not-data-pressed:before:shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none border border-foreground/15"
                }
              >
                <ChevronLeft className="size-[13px]" />
              </Button>
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
              if (chatModalOpen && sidePanel === "execute") {
                toast.info("Use the execute panel to execute the workflow");
                return;
              }

              setChatModalOpen(true);
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
