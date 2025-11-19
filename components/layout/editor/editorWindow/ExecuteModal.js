"use client";

import { Input } from "@/components/ui/input";
import {
  ArrowUpRight,
  CirclePlay,
  Copy,
  FlaskConical,
  Link2,
  Play,
  Waypoints,
  Webhook,
} from "lucide-react";
import useWorkflowStore from "@/store/useWorkspaceStore";
import { Button } from "@/components/ui/button";

export default function ExecuteModal() {
  const { workflow } = useWorkflowStore();

  return (
    <div className="w-[400px] flex flex-col pr-2">
      <div className="flex flex-1 flex-col border border-foreground/15 bg-background rounded-md">
        <div className="flex gap-2 text-sm border-b border-foreground/15 p-4 relative z-20 shrink-0">
          <Play className="size-4 mt-1" />
          <div className="flex flex-col">
            <p>Execute</p>
            <p className="text-xs text-muted-foreground">
              Try your workflow and test the endpoints
            </p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden relative z-20 flex-1 min-h-0">
          <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0">
            <div className="space-y-2 p-4 pb-0">
              <p className="text-[10px] text-foreground/50 flex items-center gap-1">
                <CirclePlay className="size-3" /> Trigger Preview
              </p>

              <div className="bg-card p-4 rounded-lg flex items-center gap-2 justify-between border border-foreground/15">
                <div className="">
                  <p className="text-xs font-medium text-foreground/80">
                    No Trigger Present
                  </p>
                  <p className="text-[10px] text-foreground/50">
                    Workflow is accessible as an{" "}
                    <span className="font-medium text-foreground/80">API</span>
                  </p>
                </div>
                <Webhook className="size-8 opacity-15" />
              </div>
            </div>

            <div className="space-y-2 p-4 pb-0">
              <p className="text-[10px] text-foreground/50 flex items-center gap-1">
                <Link2 className="size-3" /> Endpoint
              </p>

              <Input
                variant="outline"
                value={`${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${workflow?.id}`}
                readOnly
                className="py-1 rounded-sm border-foreground/15 bg-card dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
                style={{ fontSize: "12px" }}
              />

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  className="flex-1 text-xs bg-background border gap-1.5 border-foreground/15 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
                >
                  <Copy /> Copy
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-xs bg-background border gap-1.5 border-foreground/15 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
                >
                  <ArrowUpRight /> Open
                </Button>
              </div>
            </div>

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
                  Click on Test to check the endpoint URL, the endpoint url
                  checks the{" "}
                  <span className="bg-blue-100 border border-foreground/15 p-1 rounded-sm font-medium text-foreground/80">
                    last saved version
                  </span>{" "}
                  of the workflow
                </p>
              </div>

              <div className="flex gap-2">
                <Play className="size-5 opacity-50 mt-1" />
                <p className="text-[10px] text-foreground/50 leading-5">
                  Click on Run to check the endpoint URL, the endpoint url
                  checks the{" "}
                  <span className="bg-yellow-100 border border-foreground/15 p-1 rounded-sm font-medium text-foreground/80">
                    Unsaved version
                  </span>{" "}
                  of the workflow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
