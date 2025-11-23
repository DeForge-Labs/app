"use client";

import { AlertCircle, CheckCircle, Info } from "lucide-react";

export default function LogsTimeline({ logs }) {
  const getLogIcon = (level) => {
    switch (level) {
      case "success":
        return <CheckCircle className="size-3 text-green-500" />;
      case "error":
        return <AlertCircle className="size-3 text-red-500" />;
      default:
        return <Info className="size-3 text-blue-500" />;
    }
  };

  const getLogColor = (level) => {
    switch (level) {
      case "success":
        return "border-green-500/20 bg-green-500/5";
      case "error":
        return "border-red-500/20 bg-red-500/5";
      default:
        return "border-blue-500/20 bg-blue-500/5";
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  };

  return (
    <div className="p-6 py-4 space-y-3">
      {logs.map((log, index) => (
        <div
          key={index}
          className={`border rounded-sm p-2 flex gap-2 ${getLogColor(
            log.level
          )}`}
        >
          <div className="flex-shrink-0 mt-0.5">{getLogIcon(log.level)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-mono text-muted-foreground">
                {formatTime(log.time)}
              </span>
              <span className="text-[10px] uppercase text-muted-foreground">
                {log.level}
              </span>
            </div>
            <p className="text-[12px] text-foreground break-words">
              {log.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
