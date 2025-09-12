"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronUp,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  Terminal,
  Loader,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { removeNewLog } from "@/redux/slice/WorkflowSlice";
import JsonViewer from "./JSONViewer";
import LogViewer from "./LogViewer";
import { cn } from "@/lib/utils";
import StatsWindow from "./StatsWindow";

export default function ExecutionLogsPanel({ isForm = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const logs = useSelector((state) => state.workflow.logs);
  const isLogInitializing = useSelector(
    (state) => state.workflow.isLogInitializing
  );
  const newLogs = useSelector((state) => state.workflow.newLogs);
  const dispatch = useDispatch();

  // Get the selected execution details
  const execution = logs.find((exec) => exec.id === selectedExecution);

  useEffect(() => {
    if (isLogInitializing) {
      setIsExpanded(false);
      setSelectedExecution(null);
    }
  }, [isLogInitializing]);

  return (
    <div
      className={cn(
        ` bg-background transition-all duration-300 z-10 dark:bg-dark dark:border-background dark:text-background`,
        isExpanded ? "h-80" : "h-12"
      )}
    >
      {/* Header bar */}
      <div
        className={cn(
          "flex items-center justify-between bg-black/5 border-black/50 border-t px-4 h-12 border-b  cursor-pointer dark:bg-dark dark:border-background dark:text-background",
          isForm ? "rounded-t-lg border-x max-w-5xl mx-auto" : ""
        )}
        onClick={() => {
          if (!isLogInitializing) {
            setIsExpanded(!isExpanded);
          } else {
            setIsExpanded(false);
          }
        }}
      >
        <div className="flex items-center dark:text-background">
          {isLogInitializing ? (
            <Loader className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Terminal className="h-4 w-4 mr-2" />
          )}
          <span className="font-medium text-sm">Execution Logs</span>

          {newLogs.length > 0 && (
            <Badge className="ml-2 text-xs px-1.5 py-0 opacity-70 bg-blue-400 text-white capitalize">
              {newLogs.length}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="dark:text-background"
          onPress={() => {
            if (!isLogInitializing) {
              setIsExpanded(!isExpanded);
            } else {
              setIsExpanded(false);
              dispatch(removeNewLog());
            }
          }}
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
        <div
          className={cn(
            "flex h-[calc(100%-3rem)] overflow-hidden",
            isForm
              ? "border-x border-black/50 dark:border-background max-w-5xl mx-auto"
              : ""
          )}
        >
          {/* Executions list */}
          <div className="w-64 border-r border-black/20 overflow-y-auto py-2 dark:border-background">
            <h3 className="text-sm font-medium pb-2 pl-2 border-b border-black/20 dark:border-background">
              Recent Executions
            </h3>
            {logs.map((exec) => {
              const isNewLog =
                newLogs.filter((log) => log.id === exec.id).length > 0;
              return (
                <div
                  key={exec.id}
                  className={`p-2 cursor-pointer hover:bg-muted border-b border-black/20 dark:border-background ${
                    selectedExecution === exec.id ? "bg-black/5" : ""
                  } ${isNewLog ? "bg-yellow-500/20" : ""}`}
                  onClick={() => {
                    dispatch(removeNewLog(exec));
                    setSelectedExecution(exec.id);
                  }}
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
              );
            })}
          </div>

          {/* Execution details */}
          <div className="flex-1 overflow-hidden flex flex-col dark:border-background">
            {execution ? (
              <>
                <div className="p-3 border-b border-black/20 dark:border-background">
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
                  <div className="flex items-center mt-1 gap-2">
                    {execution.status === "completed" && (
                      <div className="text-xs">
                        Processing time: {execution.result.processingTime}
                      </div>
                    )}

                    <Badge
                      className="text-xs capitalize"
                      style={{
                        backgroundColor:
                          execution.type === "live"
                            ? "#C8E6C9"
                            : execution.type === "test"
                            ? "#FDD8AE"
                            : "#FBC2C4",
                        color:
                          execution.type === "live"
                            ? "#1B5E20"
                            : execution.type === "test"
                            ? "#855C00"
                            : "#855C00",
                      }}
                    >
                      {execution.type}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                  <LogViewer
                    logs={execution.logs}
                    totalCredits={execution.totalCredits}
                  />

                  <JsonViewer data={execution.result} />
                  <StatsWindow stats={execution.stats} />
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
