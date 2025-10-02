"use client";

import useExecution from "@/hooks/useExecution";
import { cn } from "@/lib/utils";
import { Tooltip } from "@heroui/react";
import { Button } from "@heroui/react";
import { Loader2, Play } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setPanel } from "@/redux/slice/WorkflowSlice";

export default function RunButton({ className }) {
  const isRunning = useSelector((state) => state.run.isRunning);
  const type = useSelector((state) => state.run.type);
  const workflow = useSelector((state) => state.workflow.workflow);
  const nodes = useSelector((state) => state.workflow.nodes || []);
  const { handleRun, handleRunLive } = useExecution();
  const dispatch = useDispatch();

  const isTelegramTriggerPresent =
    nodes.filter((node) => node.type === "tg_trigger").length > 0;

  const isChatBotTriggerPresent =
    nodes.filter((node) => node.type === "chatbot_trigger").length > 0;

  const isWidgetTriggerPresent =
    nodes.filter((node) => node.type === "widget_trigger").length > 0;

  const isGmailTriggerPresent =
    nodes.filter((node) => node.type === "gmail_trigger").length > 0;

  const isApiTriggerPresent =
    nodes.filter((node) => node.type === "api_trigger").length > 0;

  return (
    !isTelegramTriggerPresent &&
    !isWidgetTriggerPresent &&
    !isGmailTriggerPresent && (
      <Tooltip
        className="bg-white border-black/50 border mb-3 rounded-lg shadow-none"
        content={
          <div className="p-2 text-xs">
            <p>Run workflow</p>
          </div>
        }
      >
        {workflow?.status !== "LIVE" ? (
          <Button
            onPress={() => {
              if (isApiTriggerPresent) {
                dispatch(setPanel(2));
                return;
              }

              if (isChatBotTriggerPresent) {
                window.open(
                  `https://chat.deforge.io/?workflowId=${workflow?.id}&status=test`,
                  "_blank"
                );
              } else {
                handleRun();
              }
            }}
            variant="icon"
            className={cn(
              "w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-2 " +
                className
            )}
            size="icon"
            isDisabled={isRunning}
          >
            {isRunning && type === "raw" ? (
              <Loader2 size={16} className="animate-spin text-background" />
            ) : (
              <Play size={16} />
            )}
          </Button>
        ) : (
          <Button
            onPress={() => {
              if (isApiTriggerPresent) {
                dispatch(setPanel(2));
                return;
              }

              if (isChatBotTriggerPresent) {
                window.open(
                  `https://chat.deforge.io/?workflowId=${workflow?.id}`,
                  "_blank"
                );
              } else {
                handleRunLive();
              }
            }}
            variant="icon"
            className={cn(
              "w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-2 " +
                className
            )}
            size="icon"
            isDisabled={isRunning || isTelegramTriggerPresent}
          >
            {isRunning && type === "live" ? (
              <Loader2 size={16} className="animate-spin text-background" />
            ) : (
              <Play size={16} />
            )}
          </Button>
        )}
      </Tooltip>
    )
  );
}
