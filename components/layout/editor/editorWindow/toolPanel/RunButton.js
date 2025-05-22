"use client";

import useExecution from "@/hooks/useExecution";
import { cn } from "@/lib/utils";
import { Tooltip } from "@heroui/react";
import { Button } from "@heroui/react";
import { Loader2, Play } from "lucide-react";
import { useSelector } from "react-redux";

export default function RunButton() {
  const isRunning = useSelector((state) => state.run.isRunning);
  const type = useSelector((state) => state.run.type);
  const workflow = useSelector((state) => state.workflow.workflow);
  const nodes = useSelector((state) => state.workflow.nodes || []);
  const { handleRun, handleRunLive } = useExecution();

  const isTelegramTriggerPresent = nodes.some(
    (node) => node.type === "tg_trigger"
  );

  return (
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
          onPress={() => handleRun()}
          variant="icon"
          className={cn(
            "w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-2 "
          )}
          size="icon"
          isDisabled={isRunning || isTelegramTriggerPresent}
        >
          {isRunning && type === "raw" ? (
            <Loader2 size={16} className="animate-spin text-background" />
          ) : (
            <Play size={16} />
          )}
        </Button>
      ) : (
        <Button
          onPress={() => handleRunLive()}
          variant="icon"
          className={cn(
            "w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-2 "
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
  );
}
