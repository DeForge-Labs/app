"use client";

import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { File, Workflow } from "lucide-react";

export default function ViewerNav({ defaultView, view, setView }) {
  return (
    <div className="flex items-center justify-center p-2 px-4">
      <Tabs defaultValue={defaultView} value={view} onValueChange={setView}>
        <TabsList
          className={
            "bg-background border border-foreground/20 [&>span]:bg-foreground/90 [&>span]:ml-[1px] [&>span]:mb-[1px] dark:[&>span]:bg-foreground/90 [&>span]:rounded-sm rounded-sm p-[1px]"
          }
        >
          <TabsTab
            value="workflow"
            className="text-xs data-selected:text-background p-1"
          >
            <Workflow />
          </TabsTab>
          <TabsTab
            value="form"
            className="text-xs data-selected:text-background p-1"
          >
            <File />
          </TabsTab>
        </TabsList>
      </Tabs>
    </div>
  );
}
