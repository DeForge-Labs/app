"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import useWorkflowStore from "@/store/useWorkspaceStore";
import useChatStore from "@/store/useChatStore";
import useExecution from "@/hooks/useExecution";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RunButton({ isTemplate = false }) {
  const { nodes, setSidePanel, setExecuteModalOpen } = useWorkflowStore();
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

      setExecuteModalOpen(true);
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

      setExecuteModalOpen(true);
      setChatModalOpen(true);
      setSidePanel("execute");
    }

    if (triggerNodeType === "api_trigger") {
      toast(
        "Workflow can executed when a new API request is received or through Execute Panel",
      );

      setExecuteModalOpen(true);
      setChatModalOpen(true);
      setSidePanel("execute");
    }
  };

  return (
    <Button
      className="py-0 rounded-sm text-[10px] [&_svg:not([class*='size-'])]:size-3"
      onClick={() => {
        if (isTemplate) {
          return;
        }
        handleRun();
      }}
      disabled={isRunning}
    >
      {isRunning ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Play /> Run this workflow
        </>
      )}
    </Button>
  );
}
