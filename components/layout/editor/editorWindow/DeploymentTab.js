"use client";

import { useSelector } from "react-redux";
import LogoAnimation from "@/components/ui/LogoAnimation";
import ApiDeployments from "./deployments/ApiDeployments";
import ChatBotDeployment from "./deployments/ChatBotdeployment";
import TelegramDeployment from "./deployments/TelegramDeployments";
import WidgetDeployment from "./deployments/WidgetDeployments";

export default function DeploymentTab() {
  const isWorkflowInitializing = useSelector(
    (state) => state.workflow.isWorkflowInitializing
  );

  const nodes = useSelector((state) => state.workflow.nodes);

  const isApi =
    nodes.filter((node) => node?.data?.category === "trigger").length === 0 ||
    nodes.filter((node) => node?.type === "cron_trigger").length > 0;

  const isChatBot =
    nodes.filter((node) => node?.type === "chatbot_trigger").length > 0;

  const isTelegramTriggerPresent =
    nodes.filter((node) => node?.type === "tg_trigger").length > 0;

  const isWidgetTriggerPresent =
    nodes.filter((node) => node?.type === "widget_trigger").length > 0;

  if (isWorkflowInitializing) {
    return <LogoAnimation opacity={0.5} />;
  }

  return (
    <div className="overflow-y-auto hide-scroll flex-1 relative dark:text-background">
      <div className="flex-1 flex flex-col p-4 absolute w-full pb-16">
        <h1 className="font-semibold text-xl">Deployments</h1>

        {isApi && <ApiDeployments />}
        {isChatBot && <ChatBotDeployment />}
        {isTelegramTriggerPresent && <TelegramDeployment />}
        {isWidgetTriggerPresent && <WidgetDeployment />}
      </div>
    </div>
  );
}
