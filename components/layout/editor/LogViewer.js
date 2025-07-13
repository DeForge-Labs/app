"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@heroui/react";

const LogViewer = ({ logs, title = "Execution Logs" }) => {
  const [copied, setCopied] = useState(false);

  const getLogIcon = (level) => {
    switch (level.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case "error":
        return <AlertCircle className="h-3 w-3 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-3 w-3 text-yellow-600" />;
      case "info":
        return <Info className="h-3 w-3 text-blue-600" />;
      default:
        return <Clock className="h-3 w-3 text-amber-600" />;
    }
  };

  const getLogColor = (level) => {
    switch (level.toLowerCase()) {
      case "success":
        return "text-green-700";
      case "error":
        return "text-red-700";
      case "warning":
        return "text-yellow-700";
      case "info":
        return "text-blue-700";
      default:
        return "text-gray-700";
    }
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString();
  };

  const cleanMessage = (message) => {
    // Remove extra quotes if they exist
    if (message.startsWith('"') && message.endsWith('"')) {
      return message.slice(1, -1);
    }
    return message;
  };

  const renderLogEntry = (entry, index) => (
    <div
      key={index}
      className="flex items-start gap-2 py-1 border-b border-amber-300 last:border-b-0 dark:border-amber-100/10"
    >
      <div className="flex items-center gap-2 shrink-0">
        {getLogIcon(entry.level)}
        <span className="text-xs font-mono text-amber-600 min-w-[80px]">
          [{formatTime(entry.time)}]
        </span>
      </div>
      <div className="flex-1 min-w-0 -mt-[0.3rem]">
        <span
          className={`text-xs font-medium ${getLogColor(
            entry.level
          )} break-words leading-relaxed`}
        >
          {cleanMessage(entry.message)}
        </span>
      </div>
    </div>
  );

  const copyToClipboard = async () => {
    try {
      const logText = logs
        .map(
          (log) =>
            `[${new Date(log.time).toLocaleTimeString()}] ${cleanMessage(
              log.message
            )}`
        )
        .join("\n");
      await navigator.clipboard.writeText(logText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const executionTime = logs
    .find((entry) => cleanMessage(entry.message).includes("completed in"))
    ?.message.match(/(\d+)ms/)?.[1];

  const errorCount = logs.filter((log) => log.level === "error").length;
  const successCount = logs.filter((log) => log.level === "success").length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="flex items-center gap-4 text-xs text-amber-700 mt-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{logs.length} entries</span>
            </div>
            {successCount > 0 && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>{successCount} success</span>
              </div>
            )}
            {errorCount > 0 && (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-red-600" />
                <span>{errorCount} errors</span>
              </div>
            )}
            {executionTime && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Completed in {executionTime}ms</span>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="px-2 h-7 border border-black/50 dark:border-background"
          onPress={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="ml-1 text-xs">{copied ? "Copied!" : "Copy"}</span>
        </Button>
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-4 py-3 overflow-auto">
          <div className="font-mono">
            {logs.map((entry, index) => renderLogEntry(entry, index))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogViewer;
