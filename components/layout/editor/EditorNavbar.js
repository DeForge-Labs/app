"use client";

import {
  setMode,
  setPaneLeft,
  setPaneRight,
} from "@/redux/slice/WorkflowSlice";
import { Tooltip } from "@heroui/react";
import {
  AlertCircleIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code,
  Loader2,
  PanelLeft,
  PanelRight,
  Play,
  Rocket,
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import OptionsMenu from "./editorNavbar/OptionsMenu";
import WorkflowCard from "./editorNavbar/WorkflowCard";

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
            <WorkflowCard />
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
