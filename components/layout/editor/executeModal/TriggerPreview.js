"use client";

import {
  CirclePlay,
  Clock,
  Mail,
  MessageCircle,
  MessageCircleCodeIcon,
  Send,
  Slack,
  Webhook,
} from "lucide-react";

export default function TriggerPreview({ triggerNode }) {
  const triggerTypes = [
    {
      name: "No Trigger",
      value: undefined,
      icon: <Webhook className="size-8 opacity-15" />,
      description: (
        <>
          Workflow is triggered through an{" "}
          <span className="font-medium text-foreground/80">API</span>
        </>
      ),
    },
    {
      name: "Chat Bot Trigger",
      value: "chatbot_trigger",
      icon: <MessageCircle className="size-8 opacity-15" />,
      description: (
        <>
          Workflow is accessible through a{" "}
          <span className="font-medium text-foreground/80">Chat UI</span>
        </>
      ),
    },
    {
      name: "Cron Trigger",
      value: "cron_trigger",
      icon: <Clock className="size-8 opacity-15" />,
      description: (
        <>
          Workflow can be triggered at a{" "}
          <span className="font-medium text-foreground/80">fixed interval</span>
        </>
      ),
    },
    {
      name: "Gmail Trigger",
      value: "gmail_trigger",
      icon: <Mail className="size-8 opacity-15" />,
      description: (
        <>
          Workflow can be triggered when a{" "}
          <span className="font-medium text-foreground/80">new email</span> is
          received through{" "}
          <span className="font-medium text-foreground/80">Gmail</span>
        </>
      ),
    },
    {
      name: "Slack Trigger",
      value: "slack_trigger",
      icon: <Slack className="size-8 opacity-15" />,
      description: (
        <>
          Workflow can be triggered when a{" "}
          <span className="font-medium text-foreground/80">new message</span> is
          received through{" "}
          <span className="font-medium text-foreground/80">Slack</span>
        </>
      ),
    },
    {
      name: "Telegram Trigger",
      value: "tg_trigger",
      icon: <Send className="size-8 opacity-15" />,
      description: (
        <>
          Workflow can be triggered when a{" "}
          <span className="font-medium text-foreground/80">new message</span> is
          received through{" "}
          <span className="font-medium text-foreground/80">Telegram</span>
        </>
      ),
    },
    {
      name: "API Trigger",
      value: "api_trigger",
      icon: <Webhook className="size-8 opacity-15" />,
      description: (
        <>
          Workflow can be triggered through an{" "}
          <span className="font-medium text-foreground/80">API</span>
        </>
      ),
    },
    {
      name: "Widget Trigger",
      value: "widget_trigger",
      icon: <MessageCircleCodeIcon className="size-8 opacity-15" />,
      description: (
        <>
          Workflow can be triggered through a{" "}
          <span className="font-medium text-foreground/80">
            {" "}
            Chatbot Widget
          </span>{" "}
          embeddable in any website
        </>
      ),
    },
  ];

  const triggerType = triggerTypes.find(
    (triggerType) => triggerType.value === triggerNode?.type
  );

  return (
    <div className="space-y-2 p-4 pb-0">
      <p className="text-[10px] text-foreground/50 flex items-center gap-1">
        <CirclePlay className="size-3" /> Trigger Preview
      </p>

      <div className="bg-card p-4 rounded-lg flex items-center gap-2 justify-between border border-foreground/15">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-foreground/80">
            {triggerType?.name}
          </p>
          <p className="text-[10px] text-foreground/50 max-w-[250px]">
            {triggerType?.description}
          </p>
        </div>
        {triggerType?.icon}
      </div>
    </div>
  );
}
