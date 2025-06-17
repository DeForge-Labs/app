"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@heroui/react";

const cleanMessage = (message) => {
  // Remove extra quotes if they exist
  if (message.startsWith('"') && message.endsWith('"')) {
    return message.slice(1, -1);
  }
  return message;
};

const groupLogsByNode = (entries) => {
  const nodes = {};
  let currentNode = null;

  entries.forEach((entry) => {
    const message = cleanMessage(entry.message);

    if (
      message.includes("Starting workflow execution") ||
      message.includes("Workflow execution completed")
    ) {
      // Add workflow-level logs to a "System" group
      if (!nodes["System"]) {
        nodes["System"] = {
          type: "node",
          nodeId: null,
          entries: [],
        };
      }
      nodes["System"].entries.push({ ...entry, message });
    } else if (message.includes("Executing node:")) {
      const nodeMatch = message.match(/Executing node: ([^(]+)\s*$$([^)]+)$$/);
      if (nodeMatch) {
        currentNode = nodeMatch[1].trim();
        const nodeId = nodeMatch[2].trim();

        if (!nodes[currentNode]) {
          nodes[currentNode] = {
            type: "node",
            nodeId: nodeId,
            entries: [],
          };
        }
        nodes[currentNode].entries.push({ ...entry, message });
      } else {
        // Fallback for simpler node detection
        const simpleNodeMatch = message.match(/Executing node: (.+)/);
        if (simpleNodeMatch) {
          currentNode = simpleNodeMatch[1].trim();
          if (!nodes[currentNode]) {
            nodes[currentNode] = {
              type: "node",
              nodeId: null,
              entries: [],
            };
          }
          nodes[currentNode].entries.push({ ...entry, message });
        }
      }
    } else if (currentNode && nodes[currentNode]) {
      nodes[currentNode].entries.push({ ...entry, message });
    } else {
      // Add ungrouped logs to "System" group
      if (!nodes["System"]) {
        nodes["System"] = {
          type: "node",
          nodeId: null,
          entries: [],
        };
      }
      nodes["System"].entries.push({ ...entry, message });
    }
  });

  // Wrap in a single object to show total count when collapsed
  return {
    Logs: {
      type: "workflow",
      nodes: nodes,
      entries: [],
    },
  };
};

const LogNode = ({ data, keyName, level = 0, isLast = true }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

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

  const renderLogEntry = (entry) => (
    <div className="flex items-start gap-2 py-1">
      <div className="flex items-center gap-1 shrink-0">
        {getLogIcon(entry.level)}
        <span className="text-xs font-mono text-amber-600">
          [{formatTime(entry.time)}]
        </span>
      </div>
      <div className="flex-1 min-w-0 -mt-1">
        <span
          className={`text-xs font-medium ${getLogColor(
            entry.level
          )} break-words`}
        >
          {entry.message}
        </span>
      </div>
    </div>
  );

  const renderValue = (value) => {
    if (value.type === "workflow") {
      const hasNodes = Object.keys(value.nodes).length > 0;
      const totalEntries =
        value.entries.length +
        Object.values(value.nodes).reduce(
          (acc, node) => acc + node.entries.length,
          0
        );

      return (
        <div className="ml-1">
          <div
            className="flex items-center cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -ml-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {(hasNodes || value.entries.length > 0) &&
              (isExpanded ? (
                <ChevronDown className="h-3 w-3 mr-1 text-amber-600" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-1 text-amber-600" />
              ))}
            <span className="text-amber-700 text-xs font-medium">{"{"}</span>
            {!isExpanded && (
              <span className="text-xs text-amber-600 ml-1 font-medium">
                {totalEntries} log entries
              </span>
            )}
            {!isExpanded && (
              <span className="text-amber-700 text-xs font-medium ml-1">
                {"}"}
              </span>
            )}
          </div>

          {isExpanded && (
            <div className="ml-4 border-l border-amber-200 pl-4">
              {/* Direct workflow entries */}
              {value.entries.map((entry, index) => (
                <div key={`entry-${index}`} className="py-0.5">
                  {renderLogEntry(entry)}
                </div>
              ))}

              {/* Node groups */}
              {Object.entries(value.nodes).map(
                ([nodeName, nodeData], index, arr) => (
                  <div key={nodeName} className="py-0.5">
                    <LogNode
                      data={nodeData}
                      keyName={nodeName}
                      level={level + 1}
                      isLast={index === arr.length - 1}
                    />
                  </div>
                )
              )}
            </div>
          )}

          {isExpanded && (
            <div className="text-amber-700 text-xs font-medium ml-4">{"}"}</div>
          )}
        </div>
      );
    }

    if (value.type === "node") {
      return (
        <div className="ml-1">
          <div
            className="flex items-center cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -ml-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {value.entries.length > 0 &&
              (isExpanded ? (
                <ChevronDown className="h-3 w-3 mr-1 text-amber-600" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-1 text-amber-600" />
              ))}
            <span className="text-amber-700 text-xs font-medium">{"["}</span>
            {!isExpanded && (
              <span className="text-xs text-amber-600 ml-1 font-medium">
                {value.entries.length} entries
              </span>
            )}
            {value.nodeId && !isExpanded && (
              <span className="text-xs text-gray-600 ml-1 font-mono">
                {value.nodeId}
              </span>
            )}
            {!isExpanded && (
              <span className="text-amber-700 text-xs font-medium ml-1">
                {"]"}
              </span>
            )}
          </div>

          {isExpanded && (
            <div className="ml-4 border-l border-amber-200 pl-4">
              {value.nodeId && (
                <div className="py-1">
                  <span className="text-xs font-mono text-gray-600">
                    ID: {value.nodeId}
                  </span>
                </div>
              )}
              {value.entries.map((entry, index) => (
                <div key={index} className="py-0.5">
                  {renderLogEntry(entry)}
                </div>
              ))}
            </div>
          )}

          {isExpanded && (
            <div className="text-amber-700 text-xs font-medium ml-4">{"]"}</div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="font-mono">
      <div className="flex items-start gap-2">
        {keyName && (
          <span className="text-xs font-semibold text-amber-800 shrink-0">
            "{keyName}":
          </span>
        )}
        <div className="flex-1 min-w-0">{renderValue(data)}</div>
      </div>
    </div>
  );
};

export default function LogViewer({ logs, title = "Execution Logs" }) {
  const [copied, setCopied] = useState(false);

  console.log(logs);

  const groupedLogs = groupLogsByNode(logs);

  const copyToClipboard = async () => {
    try {
      const logText = logs
        .map(
          (log) => `[${new Date(log.time).toLocaleTimeString()}] ${log.message}`
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
    .find((entry) => entry.message.includes("completed in"))
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
          className="px-2 h-7 border border-black/50"
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
        <CardContent className="p-4 overflow-auto">
          {Object.entries(groupedLogs).map(([key, value]) => (
            <LogNode key={key} data={value} keyName={key} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
