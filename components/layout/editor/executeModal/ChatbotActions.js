"use client";

import { ExternalLink, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatbotActions({ triggerNodeType }) {
  const widgetDocs =
    "https://docs.deforge.io/docs/library/nodes/trigger/widget_trigger";

  const chatbotDocs =
    "https://docs.deforge.io/docs/library/nodes/trigger/chatbot_trigger";

  return (
    <div className="space-y-2 p-4">
      <p className="text-[10px] text-foreground/50 flex items-center gap-1">
        <Waypoints className="size-3" /> Actions
      </p>

      <Button
        className="text-xs w-full border gap-1.5 border-foreground/15 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
        onClick={() => {
          if (triggerNodeType === "widget_trigger") {
            window.open(widgetDocs, "_blank");
          } else {
            window.open(chatbotDocs, "_blank");
          }
        }}
      >
        <ExternalLink /> API Guide
      </Button>

      <p className="text-[10px] text-foreground/50 -mt-1">
        Check our Documentation to integrate your own custom UI with Deforge
        APIs and build your own chatbot
      </p>
    </div>
  );
}
