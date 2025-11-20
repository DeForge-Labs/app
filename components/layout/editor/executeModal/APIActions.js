"use client";

import { Button } from "@/components/ui/button";
import { Play, FlaskConical, Waypoints } from "lucide-react";

export default function APIActions() {
  return (
    <div className="space-y-2 p-4">
      <p className="text-[10px] text-foreground/50 flex items-center gap-1">
        <Waypoints className="size-3" /> Actions
      </p>

      <div className="flex items-center gap-1">
        <Button className="flex-1 text-xs  border gap-1.5 border-foreground/15 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3">
          <FlaskConical /> Test
        </Button>
        <Button className="flex-1 text-xs border gap-1.5 border-foreground/15 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3">
          <Play /> Run
        </Button>
      </div>

      <div className="flex gap-2">
        <FlaskConical className="size-5 opacity-50 mt-1" />
        <p className="text-[10px] text-foreground/50 leading-5">
          Click on Test to check the endpoint URL, the endpoint url checks the{" "}
          <span className="bg-blue-100 dark:bg-blue-800 border border-foreground/15 p-1 rounded-sm font-medium text-foreground/80">
            last saved version
          </span>{" "}
          of the workflow
        </p>
      </div>

      <div className="flex gap-2">
        <Play className="size-5 opacity-50 mt-1" />
        <p className="text-[10px] text-foreground/50 leading-5">
          Click on Run to check the endpoint URL, the endpoint url checks the{" "}
          <span className="bg-yellow-100 dark:bg-yellow-800 border border-foreground/15 p-1 rounded-sm font-medium text-foreground/80">
            Unsaved version
          </span>{" "}
          of the workflow
        </p>
      </div>
    </div>
  );
}
