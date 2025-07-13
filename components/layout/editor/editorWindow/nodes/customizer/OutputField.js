"use client";

import getColorByType from "@/lib/color-profile";

export default function OutputField({ output }) {
  return (
    <div key={output.name} className="">
      <div className="flex justify-between items-center">
        <span className="text-sm capitalize">{output.name}</span>
        <div className="flex items-center gap-2 border border-black/50 rounded-md p-1 dark:border-background dark:text-background">
          <span className="text-xs">{output.type}</span>
          <div
            className="h-3 w-3 rounded-full dark:border-background dark:border"
            style={{
              backgroundColor: getColorByType(output.type.toLowerCase()),
            }}
          />
        </div>
      </div>
    </div>
  );
}
