"use client";

import { useState } from "react";
import {
  Sheet,
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
      <SheetPopup inset={false} className={"w-xl max-w-xl"}>
        <SheetHeader className="border-b border-border px-6 py-4 flex flex-row items-center justify-between">
          <div>
            <SheetTitle className="text-sm text-foreground font-medium">
              Log Details
            </SheetTitle>
            <div className="text-xs mt-1 flex flex-col gap-3">
              <span className="text-muted-foreground font-mono">{log.id}</span>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <Badge
                    className={cn(
                      getTypeColor(log.type),
                      "capitalize p-0.5 px-1.5 text-[10px] w-fit peer hover:cursor-help",
                    )}
                  >
                    {log.type}
                  </Badge>

                  <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max scale-0 rounded bg-background border border-foreground/15 px-2 py-1 text-[10px] font-medium text-foreground shadow-sm transition-all peer-hover:scale-100 z-[60]">
                    Execution Type
                  </div>
                </div>

                <div className="relative">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize p-0.5 px-1.5 text-[10px] w-fit border-foreground/20 peer hover:cursor-help",
                    )}
                  >
                    <Clock className="size-3" />
                    {new Date(log?.startedAt).toLocaleString()}
                  </Badge>
                  <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max scale-0 rounded bg-background border border-foreground/15 px-2 py-1 text-[10px] font-medium text-foreground shadow-sm transition-all peer-hover:scale-100 z-[60]">
                    Execution Time
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 -mt-1">
                <div className="relative">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize p-0.5 px-1.5 text-[10px] w-fit border-foreground/20 peer hover:cursor-help",
                    )}
                  >
                    <CircleDot className="size-3" />
                    {log?.totalCredits}
                  </Badge>
                  <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max scale-0 rounded bg-background border border-foreground/15 px-2 py-1 text-[10px] font-medium text-foreground shadow-sm transition-all peer-hover:scale-100 z-[60]">
                    Credit Cost
                  </div>
                </div>

                <div className="relative">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize p-0.5 px-1.5 text-[10px] w-fit border-foreground/20 peer hover:cursor-help",
                    )}
                  >
                    <Zap className="size-3 text-yellow-500" />
                    {calculateDuration(log?.startedAt, log?.endedAt)}
                  </Badge>
                  <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max scale-0 rounded bg-background border border-foreground/15 px-2 py-1 text-[10px] font-medium text-foreground shadow-sm transition-all peer-hover:scale-100 z-[60]">
                    Execution Duration
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="border-b border-border flex px-6">
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

        <div className="flex-1 overflow-auto custom-scrollbar">
          {activeTab === "logs" && <LogsTimeline logs={log.logs} />}
          {activeTab === "result" && (
            <div className="p-6 py-4">
              {!log?.result?.results ? (
                <div className="text-xs text-muted-foreground border border-foreground/20 p-2 py-4 border-dashed rounded-sm text-center">
                  No Results found
                </div>
              ) : (
                <JsonTreeViewer data={log?.result?.results} />
              )}
            </div>
          )}
          {activeTab === "output" && (
            <div className="p-6 py-4 space-y-4">
              {log?.result?.outputs?.length === 0 ? (
                <div className="text-xs text-muted-foreground border border-foreground/20 p-2 py-4 border-dashed rounded-sm text-center">
                  No outputs found
                </div>
              ) : (
                <JsonTreeViewer data={log?.result?.outputs} />
              )}
            </div>
          )}
        </div>
      </SheetPopup>
    </Sheet>
  );
}
