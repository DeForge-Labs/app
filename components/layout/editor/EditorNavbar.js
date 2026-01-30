"use client";

import { ChevronLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OptionsMenu from "./editorNavbar/OptionsMenu";
import WorkflowCard from "./editorNavbar/WorkflowCard";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Skeleton } from "@/components/ui/skeleton";
import ModeSwitcher from "./editorWindow/nodes/ModeSwitcher";
import useFormStore from "@/store/useFormStore";
import UndoButton from "./editorNavbar/UndoButton";
import useChatStore from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import DeployDialog from "./editorNavbar/DeployDialog";

export default function EditorNavbar() {
  const { isWorkspaceInitializing, hasUnsavedChanges } = useWorkspaceStore();
  const { hasUnsavedChanges: hasUnsavedChangesForm } = useFormStore();
  const { chatModalOpen } = useChatStore();

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
            <ModeSwitcher />

            {(hasUnsavedChanges || hasUnsavedChangesForm) && <UndoButton />}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <OptionsMenu />

          <DeployDialog>
            <Button className="text-xs gap-1.5 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3 bg-foreground/90">
              <Rocket />
              Deploy
            </Button>
          </DeployDialog>
        </div>
      </div>
    </header>
  );
}
