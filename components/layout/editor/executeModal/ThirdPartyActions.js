"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Waypoints } from "lucide-react";
import { Mail, Slack, Send } from "lucide-react";
import Image from "next/image";

export default function ThirdPartyActions({ triggerNodeType }) {
  const typeMap = [
    {
      type: "gmail_trigger",
      name: "Gmail Trigger",
      buttonName: "Gmail",
      link: "https://mail.google.com",
      icon: <Mail className="size-6 opacity-70" />,
      description: (
        <>
          Workflow can only be triggered when a{" "}
          <span className="font-medium text-foreground/80">new email</span> is
          received through Gmail
        </>
      ),
    },
    {
      type: "slack_trigger",
      name: "Slack Trigger",
      buttonName: "Slack",
      link: "https://slack.com/app/open",
      icon: <Slack className="size-6 opacity-70" />,
      description: (
        <>
          Workflow can only be triggered when a new message is received through
          <span className="font-medium text-foreground/80"> Slack</span>
        </>
      ),
    },
    {
      type: "tg_trigger",
      name: "Telegram Trigger",
      buttonName: "Telegram",
      link: "https://web.telegram.org/",
      icon: <Send className="size-6 opacity-70" />,
      description: (
        <>
          Workflow can only be triggered when a new message is received through
          <span className="font-medium text-foreground/80"> Telegram</span>
        </>
      ),
    },
    {
      type: "discord_trigger",
      name: "Discord Trigger",
      buttonName: "Discord",
      link: "https://discord.com/app",
      icon: (
        <Image
          src="/logo/discord.svg"
          alt="Discord"
          width={30}
          height={30}
          className="opacity-70"
        />
      ),
      description: (
        <>
          Workflow can only be triggered when a new message is received through
          <span className="font-medium text-foreground/80"> Discord</span>
        </>
      ),
    },
  ];

  const type = typeMap.find((type) => type.type === triggerNodeType);

  return (
    <div className="space-y-2 p-4">
      <p className="text-[10px] text-foreground/50 flex items-center gap-1">
        <Waypoints className="size-3" /> Actions
      </p>

      <div className="bg-card p-4 py-6 border-dashed rounded-lg flex flex-col items-center text-center gap-2  border border-foreground/15">
        <div className="flex items-center gap-1 p-2 bg-yellow-100 text-yellow-900 rounded-md border border-yellow-500">
          {type?.icon}
        </div>
        <p className="text-[10px] text-foreground/50 max-w-[250px]">
          {type?.description}
        </p>

        <Button
          variant="outline"
          className="w-full mt-1 text-xs gap-1 [&_svg:not([class*='size-'])]:size-3 rounded-sm"
          onClick={() => window.open(type?.link, "_blank")}
        >
          <ExternalLink /> Open {type?.buttonName}
        </Button>
      </div>
    </div>
  );
}
