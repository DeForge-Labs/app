"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useFormStore from "@/store/useFormStore";
import { Loader2, Play } from "lucide-react";
import useWorkflowStore from "@/store/useWorkspaceStore";
import SaveDialog from "../SaveDialog";
import useExecution from "@/hooks/useExecution";
import useChatStore from "@/store/useChatStore";
import { toast } from "sonner";

export default function FormToolPanel() {
  const {
    hasUnsavedChanges: formHasUnsavedChanges,
    isPreview,
    setIsPreview,
  } = useFormStore();
  const {
    hasUnsavedChanges: workflowHasUnsavedChanges,
    nodes,
    setSidePanel,
  } = useWorkflowStore();
  const { setChatModalOpen } = useChatStore();

  const triggerNode = nodes?.find((node) => node?.data?.category === "trigger");

  const triggerNodeType = triggerNode?.type;

  const { handleRun: handleRaw } = useExecution();
  const { isRunning } = useWorkflowStore();

  const handleRun = async () => {
    if (triggerNodeType === "cron_trigger" || triggerNodeType === undefined) {
      handleRaw();
    }

    if (
      triggerNodeType === "chatbot_trigger" ||
      triggerNodeType === "widget_trigger"
    ) {
      if (triggerNodeType === "chatbot_trigger") {
        toast(
          "Test your workflow by chatting with the chatbot or Execute Panel",
        );
      }

      if (triggerNodeType === "widget_trigger") {
        toast(
          "Test your workflow by chatting with the widget or Execute Panel",
        );
      }

      setChatModalOpen(true);
      setSidePanel("execute");
    }

    if (
      triggerNodeType === "gmail_trigger" ||
      triggerNodeType === "slack_trigger" ||
      triggerNodeType === "tg_trigger" ||
      triggerNodeType === "discord_trigger"
    ) {
      if (triggerNodeType === "gmail_trigger") {
        toast(
          "Workflow can executed when a new email is received through Gmail",
        );
      }

      if (triggerNodeType === "slack_trigger") {
        toast(
          "Workflow can executed when a new message is received through Slack",
        );
      }

      if (triggerNodeType === "tg_trigger") {
        toast(
          "Workflow can executed when a new message is received through Telegram",
        );
      }

      if (triggerNodeType === "discord_trigger") {
        toast(
          "Workflow can executed when a new message is received through Discord",
        );
      }

      setSidePanel("execute");
      setChatModalOpen(true);
    }

    if (triggerNodeType === "api_trigger") {
      toast(
        "Workflow can executed when a new API request is received or through Execute Panel",
      );

      setSidePanel("execute");
      setChatModalOpen(true);
    }
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center z-20">
      <div className="flex items-center bg-background rounded-md">
        <Button
          className="text-[10px] rounded-md rounded-r-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3"
          onClick={handleRun}
          disabled={isRunning}
        >
          {isRunning ? <Loader2 className="animate-spin" /> : <Play />}
        </Button>
        <SaveDialog>
          <Button
            variant={"outline"}
            className="text-[10px] w-16 rounded-md rounded-l-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3 bg-card border border-foreground/50 border-l-0"
            disabled={!formHasUnsavedChanges && !workflowHasUnsavedChanges}
          >
            {formHasUnsavedChanges || workflowHasUnsavedChanges
              ? "Save"
              : "Saved"}
            {formHasUnsavedChanges || workflowHasUnsavedChanges ? (
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            ) : null}
          </Button>
        </SaveDialog>
      </div>

      <div className="ml-2 flex items-center bg-background rounded-md">
        <Button
          variant={isPreview ? "outline" : "default"}
          className={cn(
            "text-[10px] w-16 rounded-md rounded-r-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3 border border-foreground/50 border-r-0",
            isPreview && "bg-card",
          )}
          onClick={() => setIsPreview(false)}
        >
          Edit
        </Button>
        <Button
          variant={isPreview ? "default" : "outline"}
          className={cn(
            "text-[10px] w-16 rounded-md rounded-l-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3 border border-foreground/50 border-l-0",
            !isPreview && "bg-card",
          )}
          onClick={() => setIsPreview(true)}
        >
          Preview
        </Button>
      </div>
    </div>
  );
}
