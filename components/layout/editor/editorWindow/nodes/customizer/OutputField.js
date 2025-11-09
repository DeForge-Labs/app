"use client";

import getColorByType from "@/lib/color-profile";
import { Badge } from "@/components/ui/badge";

export default function OutputField({ output }) {
  return (
    <div key={output.name} className="">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-foreground/70 capitalize">
          {output.name}
        </span>
        <Badge
          variant="secondary"
          className="text-[10px] w-fit px-2 py-1 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
        >
          <span className="text-[10px]">{output.type}</span>
          <div
            className="h-2 w-2 rounded-full dark:border-foreground dark:border"
            style={{
              backgroundColor: getColorByType(output.type.toLowerCase()),
            }}
          />
        </Badge>
      </div>
    </div>
  );
}
