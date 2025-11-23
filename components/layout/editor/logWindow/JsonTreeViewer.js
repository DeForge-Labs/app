"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JsonTreeViewer({ data, level = 0 }) {
  const [expandedKeys, setExpandedKeys] = useState(
    new Set(level < 2 ? ["root"] : [])
  );

  const toggleExpand = (key) => {
    const newExpanded = new Set(expandedKeys);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedKeys(newExpanded);
  };

  const renderValue = (value, keyPath = "") => {
    if (value === null) {
      return <span className="text-amber-500">null</span>;
    }

    if (typeof value === "boolean") {
      return <span className="text-blue-500">{value.toString()}</span>;
    }

    if (typeof value === "number") {
      return <span className="text-green-500">{value}</span>;
    }

    if (typeof value === "string") {
      return <span className="text-red-500">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      return renderArray(value, keyPath);
    }

    if (typeof value === "object") {
      return renderObject(value, keyPath);
    }

    return <span>{String(value)}</span>;
  };

  const renderArray = (arr, keyPath) => {
    const isExpanded = expandedKeys.has(keyPath);
    const hasItems = arr.length > 0;

    return (
      <div className="space-y-1">
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-foreground text-muted-foreground"
          onClick={() => toggleExpand(keyPath)}
        >
          {hasItems && (
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          )}
          <span className="text-foreground font-mono">[{arr.length}]</span>
        </div>
        {isExpanded && hasItems && (
          <div className="ml-4 space-y-1">
            {arr.map((item, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-muted-foreground font-mono">
                  [{index}]:
                </span>
                <div>{renderValue(item, `${keyPath}[${index}]`)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderObject = (obj, keyPath) => {
    const isExpanded = expandedKeys.has(keyPath);
    const keys = Object.keys(obj);
    const hasKeys = keys.length > 0;

    return (
      <div className="space-y-1">
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-foreground text-muted-foreground"
          onClick={() => toggleExpand(keyPath)}
        >
          {hasKeys && (
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          )}
          <span className="text-foreground font-mono">
            {"{"}
            {hasKeys ? "..." : ""}
            {"}"}
          </span>
        </div>
        {isExpanded && hasKeys && (
          <div className="ml-4 space-y-1">
            {keys.map((key) => (
              <div key={key} className="flex gap-2">
                <span className="text-purple-500 font-mono">{key}:</span>
                <div>{renderValue(obj[key], `${keyPath}.${key}`)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!data) return <div className="text-xs">No Data</div>;

  return <div className="text-xs font-mono">{renderValue(data, "root")}</div>;
}
