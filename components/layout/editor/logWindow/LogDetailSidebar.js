"use client";

import { useState } from "react";
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet";
import JsonTreeViewer from "./JsonTreeViewer";
import LogsTimeline from "./LogTimeline";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CircleDot, Clock, Zap } from "lucide-react";

export default function LogsDetailsSidebar({ log, onClose }) {
  const [activeTab, setActiveTab] = useState("logs");

  const getTypeColor = (type) => {
    const colors = {
      test: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      raw: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      live: "bg-green-500/10 text-green-500 border-green-500/20",
    };
    return colors[type] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  const calculateDuration = (startedAt, endedAt) => {
    const start = new Date(startedAt).getTime();
    const end = new Date(endedAt).getTime();
    const durationMs = end - start;

    if (durationMs < 1000) return `${durationMs}ms`;
    return `${(durationMs / 1000).toFixed(2)}s`;
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetPopup inset={false} className={"w-md max-w-md"}>
        <SheetHeader className="border-b border-border px-6 py-4 flex flex-row items-center justify-between">
          <div>
            <SheetTitle className="text-sm text-foreground font-medium">
              Log Details
            </SheetTitle>
            <div className="text-xs mt-1 flex flex-col gap-3">
              <span className="text-muted-foreground font-mono">{log.id}</span>
              <div className="flex items-center gap-1">
                <Badge
                  className={cn(
                    getTypeColor(log.type),
                    "capitalize p-0.5 px-1.5 text-[10px] w-fit"
                  )}
                >
                  {log.type}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize p-0.5 px-1.5 text-[10px] w-fit border-foreground/20"
                  )}
                >
                  <Clock className="size-3" />
                  {new Date(log?.startedAt).toLocaleString()}
                </Badge>
              </div>
              <div className="flex items-center gap-1 -mt-1">
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize p-0.5 px-1.5 text-[10px] w-fit border-foreground/20"
                  )}
                >
                  <CircleDot className="size-3" />
                  {log?.totalCredits}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize p-0.5 px-1.5 text-[10px] w-fit border-foreground/20"
                  )}
                >
                  <Zap className="size-3 text-yellow-500" />
                  {calculateDuration(log?.startedAt, log?.endedAt)}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="border-b border-border flex px-6 -mt-3">
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-2 border-b-2 transition-colors text-[12px] font-medium ${
              activeTab === "logs"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Execution Logs
          </button>
          <button
            onClick={() => setActiveTab("result")}
            className={`px-3 py-2 border-b-2 transition-colors text-[12px] font-medium ${
              activeTab === "result"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`px-3 py-2 border-b-2 transition-colors text-[12px] font-medium ${
              activeTab === "output"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Outputs
          </button>
        </div>

        <div className="flex-1 overflow-auto -mt-4">
          {activeTab === "logs" && <LogsTimeline logs={log.logs} />}
          {activeTab === "result" && (
            <div className="p-6 py-4">
              <JsonTreeViewer data={log?.result?.results} />
            </div>
          )}
          {activeTab === "output" && (
            <div className="p-6 py-4 space-y-4">
              {log?.result?.outputs?.length === 0 && (
                <div className="text-xs text-muted-foreground border border-foreground/20 p-2 py-4 border-dashed rounded-sm text-center">
                  No outputs found
                </div>
              )}
              {log?.result?.outputs?.map((output, index) => (
                <JsonTreeViewer key={index} data={output} />
              ))}
            </div>
          )}
        </div>
      </SheetPopup>
    </Sheet>
  );
}
