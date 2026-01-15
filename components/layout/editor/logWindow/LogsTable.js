"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Logs,
  SortAsc,
  SortDesc,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function LogsTable({
  logs,
  newLogs = [],
  selectedLogId,
  onSelectLog,
}) {
  const [sortBy, setSortBy] = useState("date");

  const calculateDuration = (startedAt, endedAt) => {
    const start = new Date(startedAt).getTime();
    const end = new Date(endedAt).getTime();
    const durationMs = end - start;

    if (durationMs < 1000) return `${durationMs}ms`;
    return `${(durationMs / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getTypeColor = (type) => {
    const colors = {
      test: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      raw: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      live: "bg-green-500/10 text-green-500 border-green-500/20",
    };
    return colors[type] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  const getStatusColor = (status) => {
    return status === "completed"
      ? "bg-green-500/10 text-green-500"
      : "bg-red-500/10 text-red-500";
  };

  const sortedLogs = [...logs].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
    }
    const aDuration =
      new Date(a.endedAt).getTime() - new Date(a.startedAt).getTime();
    const bDuration =
      new Date(b.endedAt).getTime() - new Date(b.startedAt).getTime();
    return aDuration - bDuration;
  });

  return (
    <div className="h-full overflow-y-auto relative custom-scrollbar">
      <div className="sticky top-0 grid grid-cols-[75px_100px_175px_125px_1fr_50px] gap-4 px-8 py-4 border-b border-foreground/15 text-xs text-muted-foreground bg-background z-10">
        <div>Type</div>
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-foreground"
          onClick={() => setSortBy("duration")}
        >
          Duration{" "}
          {sortBy === "duration" ? (
            <SortAsc className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-foreground"
          onClick={() => setSortBy("date")}
        >
          Started At{" "}
          {sortBy === "date" ? (
            <SortDesc className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
        </div>
        <div>Status</div>
        <div>Log ID</div>
        <div></div>
      </div>

      {sortedLogs.length === 0 ? (
        <div className="mt-20 text-center text-muted-foreground flex flex-col w-full gap-2 text-xs items-center justify-center">
          <div className="bg-card/70 p-3 rounded-md">
            <Logs className="size-6" />
          </div>
          <p>
            No Logs Found! Run your workflow <br /> to see logs here.
          </p>
        </div>
      ) : null}

      {sortedLogs.map((log) => {
        const isNew = newLogs?.some((n) => n.id === log.id);

        return (
          <div
            key={log.id}
            onClick={() => onSelectLog(log.id)}
            className={cn(
              "grid grid-cols-[75px_100px_175px_125px_1fr_50px] gap-4 px-8 py-4 border-b border-foreground/15 cursor-pointer transition-all duration-200",
              "hover:bg-card/50",
              isNew && "bg-blue-500/5 border-l-2 border-l-blue-500"
            )}
          >
            <div className="flex items-center">
              <Badge
                className={cn(
                  getTypeColor(log.type),
                  "capitalize p-0.5 px-1.5 text-[10px]"
                )}
              >
                {log.type}
              </Badge>
              {isNew && (
                <div className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              )}
            </div>

            <div className="flex items-center text-xs">
              <span className="flex items-center gap-1">
                <Zap className="size-3 text-amber-500" />
                {calculateDuration(log.startedAt, log.endedAt)}
              </span>
            </div>

            <div className="flex items-center text-xs text-muted-foreground">
              {formatDate(log.startedAt)}
            </div>

            <div className="flex items-center">
              <Badge
                className={cn(
                  getStatusColor(log.status),
                  "capitalize p-0.5 px-1.5 text-[10px]"
                )}
              >
                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
              </Badge>
            </div>

            <div className="flex items-center text-sm font-mono text-muted-foreground truncate">
              {log.id}
            </div>

            <div className="flex items-center justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLog(log.id);
                }}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
