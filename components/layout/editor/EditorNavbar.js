"use client";

import {
  ChevronLeft,
  Code,
  MessageCircle,
  PanelLeftIcon,
  PanelRightIcon,
  Play,
  Rocket,
} from "lucide-react";
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

export default function EditorNavbar() {
  const {
    isWorkspaceInitializing,
    hasUnsavedChanges,
    sidePanel,
    setSidePanel,
  } = useWorkspaceStore();
  const { hasUnsavedChanges: hasUnsavedChangesForm } = useFormStore();
  const { chatModalOpen, setChatModalOpen } = useChatStore();

  return (
    <header className="sticky top-0 z-50 bg-foreground/5 relative">
      <div className="flex items-center justify-between px-2 h-[50px]">
        <div
          className={cn(
            "flex items-center justify-start gap-1 h-full max-w-[485px] w-full",
            chatModalOpen ? "justify-between" : ""
          )}
        >
          <div className="flex items-center gap-1 h-full">
            <Link
              href="/dashboard"
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
              onClick={() => setChatModalOpen(!chatModalOpen)}
            >
              {chatModalOpen ? <PanelLeftIcon /> : <PanelRightIcon />}
            </Button>

            <ModeSwitcher />

            {(hasUnsavedChanges || hasUnsavedChangesForm) && <UndoButton />}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <OptionsMenu />

          {sidePanel === "chat" && (
            <Button
              variant="outline"
              className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
              onClick={() => setSidePanel("execute")}
            >
              <Play />
              Execute
            </Button>
          )}

          {sidePanel === "execute" && (
            <Button
              variant="outline"
              className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
              onClick={() => setSidePanel("chat")}
            >
              <MessageCircle />
              Chat
            </Button>
          )}

          <Button className="text-xs gap-1.5 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3 bg-foreground/90">
            <Rocket />
            Deploy
          </Button>
        </div>
      </div>
    </header>
  );
}
