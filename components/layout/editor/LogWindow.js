"use client";

import useWorkflowStore from "@/store/useWorkspaceStore";
import { Terminal } from "lucide-react";
import LogLoader from "./logWindow/LogLoader";
import LogsTable from "./logWindow/LogsTable";
import { useState } from "react";
import LogsDetailsSidebar from "./logWindow/LogDetailSidebar";

export default function LogsWindow() {
  const { isLogInitializing } = useWorkflowStore();
  const { logs } = useWorkflowStore();
  const [selectedLogId, setSelectedLogId] = useState(null);
  const selectedLog = logs?.find((log) => log.id === selectedLogId);

  return (
    <div className="flex flex-1 flex-col bg-background rounded-md h-full">
      <div className="flex gap-2 text-sm border-b border-foreground/15 p-4 relative z-20 shrink-0">
        <Terminal className="size-4 mt-0.75" />
        <div className="flex flex-col">
          <p>Execution Logs</p>
          <p className="text-xs text-muted-foreground">
            View execution logs of your workflow and get live updates on your
            workflow execution
          </p>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden relative z-20 flex-1 min-h-0 rounded-md">
        {isLogInitializing ? (
          <div className="flex items-center justify-center flex-1 min-h-0">
            <LogLoader />
          </div>
        ) : (
          <LogsTable
            logs={logs}
            selectedLogId={selectedLogId}
            onSelectLog={setSelectedLogId}
          />
        )}{" "}
        {selectedLog && (
          <LogsDetailsSidebar
            log={selectedLog}
            onClose={() => setSelectedLogId(null)}
          />
        )}
      </div>
    </div>
  );
}
