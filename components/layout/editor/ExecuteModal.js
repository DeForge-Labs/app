"use client";

import { Loader2, Play } from "lucide-react";
import useWorkflowStore from "@/store/useWorkspaceStore";
import TriggerPreview from "./executeModal/TriggerPreview";
import Endpoint from "./executeModal/Endpoint";
import APIActions from "./executeModal/APIActions";
import ThirdPartyActions from "./executeModal/ThirdPartyActions";
import CustomAPIActions from "./executeModal/CustomAPIActions";
import ChatbotEndpoint from "./executeModal/ChatBotEndpoint";
import ChatbotActions from "./executeModal/ChatbotActions";
import WorkflowEndpoint from "./executeModal/WorkflowEndpoint";
import ChatWindow from "./executeModal/ChatWindow";
import NodeLoader from "./editorWindow/NodeLoader";

export default function ExecuteModal() {
  const { workflow, isWorkspaceInitializing } = useWorkflowStore();
  const { nodes } = useWorkflowStore();

  const triggerNode = nodes?.find((node) => node?.data?.category === "trigger");

  const triggerNodeType = triggerNode?.type;

  return (
    <div className="w-[400px] flex flex-col pr-2">
      <div className="flex flex-1 flex-col border border-foreground/15 bg-background rounded-md h-full">
        <div className="flex gap-2 text-sm border-b border-foreground/15 p-4 relative z-20 shrink-0">
          <Play className="size-4 mt-1" />
          <div className="flex flex-col">
            <p>Execute</p>
            <p className="text-xs text-muted-foreground">
              Try your workflow and test the endpoints
            </p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden relative z-20 flex-1 min-h-0 rounded-md">
          {isWorkspaceInitializing ? (
            <div className="flex items-center justify-center flex-1 min-h-0">
              <NodeLoader />
            </div>
          ) : (
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0">
              <TriggerPreview triggerNode={triggerNode} />

              {(triggerNodeType === "api_trigger" ||
                triggerNodeType === "cron_trigger" ||
                triggerNodeType === undefined) && (
                <Endpoint workflow={workflow} />
              )}

              {triggerNodeType === "chatbot_trigger" && (
                <ChatbotEndpoint workflow={workflow} />
              )}

              {(triggerNodeType === "chatbot_trigger" ||
                triggerNodeType === "widget_trigger") && (
                <WorkflowEndpoint workflow={workflow} />
              )}

              {(triggerNodeType === "chatbot_trigger" ||
                triggerNodeType === "widget_trigger") && <ChatbotActions />}

              {(triggerNodeType === "cron_trigger" ||
                triggerNodeType === undefined) && <APIActions />}

              {(triggerNodeType === "gmail_trigger" ||
                triggerNodeType === "slack_trigger" ||
                triggerNodeType === "tg_trigger") && (
                <ThirdPartyActions triggerNodeType={triggerNodeType} />
              )}

              {triggerNodeType === "api_trigger" && <CustomAPIActions />}

              {(triggerNodeType === "chatbot_trigger" ||
                triggerNodeType === "widget_trigger") && (
                <ChatWindow triggerNodeType={triggerNodeType} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
