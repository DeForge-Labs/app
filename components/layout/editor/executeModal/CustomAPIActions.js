"use client";

import { Play, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapFieldEditor from "../editorWindow/MapFieldEditor";

export default function CustomAPIActions() {
  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center gap-1 justify-between">
        <p className="text-[10px] text-foreground/50 flex items-center gap-1">
          <Waypoints className="size-3" /> Actions
        </p>
        <p className="font-medium text-foreground/80 text-[10px] bg-yellow-100 dark:bg-yellow-800 border border-foreground/15 p-1 py-0 rounded-sm">
          POST
        </p>
      </div>

      <Button className="text-xs w-full border gap-1.5 border-foreground/15 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3">
        <Play /> Run
      </Button>

      <div className="flex flex-col gap-2">
        <p className="flex gap-1 items-center text-[10px] text-foreground/50">
          Headers
        </p>

        <MapFieldEditor />
      </div>

      <div className="flex flex-col gap-2">
        <p className="flex gap-1 items-center text-[10px] text-foreground/50">
          Body
        </p>

        <MapFieldEditor />
      </div>

      <div className="flex flex-col gap-2">
        <p className="flex gap-1 items-center text-[10px] text-foreground/50">
          Query
        </p>

        <MapFieldEditor />
      </div>
    </div>
  );
}
