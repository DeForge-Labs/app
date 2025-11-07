"use client";

import { ChevronLeft, Code, Play, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OptionsMenu from "./editorNavbar/OptionsMenu";
import WorkflowCard from "./editorNavbar/WorkflowCard";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditorNavbar() {
  const { isLoading } = useWorkspaceStore();

  return (
    <header className="sticky top-0 z-50 bg-foreground/5">
      <div className="flex items-center justify-between px-2 h-[50px]">
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
            {isLoading ? (
              <Skeleton className="w-40 h-8 rounded-sm" />
            ) : (
              <WorkflowCard />
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <OptionsMenu />
          <Button
            variant="outline"
            className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
          >
            <Code />
            API
          </Button>
          <Button
            variant="outline"
            className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
          >
            <Play />
            Execute
          </Button>
          <Button className="text-xs gap-1.5 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3 bg-foreground/90">
            <Rocket />
            Deploy
          </Button>
        </div>
      </div>
    </header>
  );
}
