"use client";

import useWorkflowStore from "@/store/useWorkspaceStore";
import { Terminal } from "lucide-react";
import LogLoader from "./logWindow/LogLoader";
import LogsTable from "./logWindow/LogsTable";
import { useState } from "react";
import LogsDetailsSidebar from "./logWindow/LogDetailSidebar";
import { Badge } from "@/components/ui/badge";

export default function LogsWindow() {
  const { isLogInitializing, logs, newLogs, removeNewLog } = useWorkflowStore();
  const [selectedLogId, setSelectedLogId] = useState(null);

  const selectedLog = logs?.find((log) => log.id === selectedLogId);

  const handleSelectLog = (id) => {
    setSelectedLogId(id);

    if (newLogs?.some((log) => log.id === id)) {
      const log = newLogs.find((log) => log.id === id);

      removeNewLog(log);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-background rounded-md h-full">
      <div className="flex gap-2 text-sm border-b border-foreground/15 p-4 relative z-20 shrink-0 items-center justify-between">
        <div className="flex gap-2">
          <Terminal className="size-4 mt-0.75" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-medium">Execution Logs</p>
            </div>
            <p className="text-xs text-muted-foreground">
              View execution logs of your workflow and get live updates
            </p>
          </div>
        </div>
        {newLogs?.length > 0 && (
          <Badge className="ml-2 text-[10px] px-1.5 py-0 h-5 bg-blue-500 hover:bg-blue-600 text-white border-0">
            {newLogs.length} New
          </Badge>
        )}
      </div>

      <div className="flex flex-col overflow-hidden relative z-20 flex-1 min-h-0 rounded-md">
        {isLogInitializing ? (
          <div className="flex items-center justify-center flex-1 min-h-0">
            <LogLoader />
          </div>
        ) : (
          <LogsTable
            logs={logs}
            newLogs={newLogs}
            selectedLogId={selectedLogId}
            onSelectLog={handleSelectLog}
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
