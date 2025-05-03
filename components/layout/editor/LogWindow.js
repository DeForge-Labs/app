"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronUp,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@heroui/react";

// Mock execution logs based on WorkflowExecution schema
const mockExecutions = [
  {
    id: "exec-1",
    workflowId: "workflow-1",
    startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    endedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(), // 4 minutes ago
    status: "completed",
    logs: [
      {
        time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        message: "Execution started",
        level: "info",
      },
      {
        time: new Date(Date.now() - 1000 * 60 * 4.8).toISOString(),
        message: "Processing input node",
        level: "info",
      },
      {
        time: new Date(Date.now() - 1000 * 60 * 4.5).toISOString(),
        message: "Processing function node",
        level: "info",
      },
      {
        time: new Date(Date.now() - 1000 * 60 * 4.2).toISOString(),
        message: "API call successful",
        level: "success",
      },
      {
        time: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        message: "Execution completed",
        level: "success",
      },
    ],
    result: { success: true, processingTime: "1.2s", nodesProcessed: 3 },
  },
  {
    id: "exec-2",
    workflowId: "workflow-1",
    startedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    endedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(), // 14 minutes ago
    status: "failed",
    logs: [
      {
        time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        message: "Execution started",
        level: "info",
      },
      {
        time: new Date(Date.now() - 1000 * 60 * 14.8).toISOString(),
        message: "Processing input node",
        level: "info",
      },
      {
        time: new Date(Date.now() - 1000 * 60 * 14.5).toISOString(),
        message: "Processing function node",
        level: "info",
      },
      {
        time: new Date(Date.now() - 1000 * 60 * 14.2).toISOString(),
        message: "API call failed: 404 Not Found",
        level: "error",
      },
      {
        time: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        message: "Execution failed",
        level: "error",
      },
    ],
    result: {
      success: false,
      error: "API endpoint not found",
      failedNodeId: "api-node-1",
    },
  },
];

export default function ExecutionLogsPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null);

  // Get the selected execution details
  const execution = mockExecutions.find(
    (exec) => exec.id === selectedExecution
  );

  return (
    <div
      className={` bg-background border-t transition-all duration-300 z-10 ${
        isExpanded ? "h-80" : "h-12"
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between bg-black/5 border-black/50 border-t px-4 h-12 border-b">
        <div className="flex items-center">
          <Terminal className="h-4 w-4 mr-2" />
          <span className="font-medium text-sm">Execution Logs</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onPress={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="flex h-[calc(100%-3rem)] overflow-hidden">
          {/* Executions list */}
          <div className="w-64 border-r border-black/20 overflow-y-auto py-2">
            <h3 className="text-sm font-medium pb-2 pl-2 border-b border-black/20">
              Recent Executions
            </h3>
            {mockExecutions.map((exec) => (
              <div
                key={exec.id}
                className={`p-2 cursor-pointer hover:bg-muted border-b border-black/20 ${
                  selectedExecution === exec.id ? "bg-black/5" : ""
                }`}
                onClick={() => setSelectedExecution(exec.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">
                    {new Date(exec.startedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <Badge
                    className="text-xs px-1.5 py-0 opacity-70 capitalize"
                    style={{
                      backgroundColor:
                        exec.status === "completed"
                          ? "#22c55d"
                          : exec.status === "failed"
                          ? "#ef4444"
                          : "#f97316",
                    }}
                  >
                    {exec.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {exec.status === "completed"
                    ? `Processed ${exec.result.nodesProcessed} nodes`
                    : `Failed: ${exec.result.error}`}
                </div>
              </div>
            ))}
          </div>

          {/* Execution details */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {execution ? (
              <>
                <div className="p-3 border-b border-black/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        Started:{" "}
                        {new Date(execution.startedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {execution.status === "completed" ? (
                        <span className="flex items-center text-green-500 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500 text-sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                  {execution.status === "completed" && (
                    <div className="text-xs mt-1">
                      Processing time: {execution.result.processingTime}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                  <h3 className="text-sm font-medium mb-2">Logs</h3>
                  <div className="border rounded-md p-2 bg-muted/30 text-xs font-mono">
                    {execution.logs.map((log, index) => (
                      <div key={index} className="py-1">
                        <span className="text-muted-foreground">
                          [{new Date(log.time).toLocaleTimeString()}]
                        </span>{" "}
                        <span
                          className={
                            log.level === "success"
                              ? "text-green-500"
                              : log.level === "error"
                              ? "text-red-500"
                              : ""
                          }
                        >
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-sm font-medium mb-2 mt-3">Result</h3>
                  <Card className="bg-muted/30">
                    <CardContent className="p-3">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(execution.result, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full opacity-50">
                Select an execution to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
