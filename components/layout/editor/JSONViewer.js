"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@heroui/react";

const JsonNode = ({ data, keyName, level = 0, isLast = true }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

  const getDataType = (value) => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };

  const getValuePreview = (value) => {
    const type = getDataType(value);
    switch (type) {
      case "string":
        return `"${
          value.length > 50 ? value.substring(0, 50) + "..." : value
        }"`;
      case "number":
      case "boolean":
      case "null":
        return String(value);
      case "array":
        return `Array(${value.length})`;
      case "object":
        const keys = Object.keys(value);
        return `Object(${keys.length})`;
      default:
        return String(value);
    }
  };

  const renderValue = (value) => {
    const type = getDataType(value);

    if (type === "object" || type === "array") {
      const isArray = type === "array";
      const items = isArray ? value : Object.entries(value);
      const isEmpty = items.length === 0;

      return (
        <div className="ml-1">
          <div
            className="flex items-center cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -ml-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {!isEmpty &&
              (isExpanded ? (
                <ChevronDown className="h-3 w-3 mr-1 text-amber-600" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-1 text-amber-600" />
              ))}
            <span className="text-amber-700 text-xs font-medium">
              {isArray ? "[" : "{"}
            </span>
            {!isExpanded && !isEmpty && (
              <span className="text-xs text-amber-600 ml-1 font-medium">
                {isArray
                  ? `${value.length} items`
                  : `${Object.keys(value).length} keys`}
              </span>
            )}
            {!isExpanded && (
              <span className="text-amber-700 text-xs font-medium ml-1">
                {isArray ? "]" : "}"}
              </span>
            )}
          </div>

          {isExpanded && !isEmpty && (
            <div className="ml-4 border-l border-amber-200 pl-4">
              {isArray
                ? value.map((item, index) => (
                    <div key={index} className="py-0.5">
                      <JsonNode
                        data={item}
                        keyName={String(index)}
                        level={level + 1}
                        isLast={index === value.length - 1}
                      />
                    </div>
                  ))
                : Object.entries(value).map(([key, val], index, arr) => (
                    <div key={key} className="py-0.5">
                      <JsonNode
                        data={val}
                        keyName={key}
                        level={level + 1}
                        isLast={index === arr.length - 1}
                      />
                    </div>
                  ))}
            </div>
          )}

          {isExpanded && (
            <div className="text-amber-700 text-xs font-medium ml-4">
              {isArray ? "]" : "}"}
            </div>
          )}
        </div>
      );
    }

    // Primitive values
    return (
      <div className="-mt-1">
        <span
          className={`text-xs font-medium ${
            type === "string"
              ? "text-emerald-700" // Deep green for good contrast on cream
              : type === "number"
              ? "text-blue-700" // Deep blue for numbers
              : type === "boolean"
              ? "text-purple-700" // Deep purple for booleans
              : type === "null"
              ? "text-gray-600" // Medium gray for null
              : "text-gray-800" // Dark gray for other types
          }`}
        >
          {getValuePreview(value)}
        </span>
      </div>
    );
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

export default function JsonViewer({ data, title = "Result" }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium">{title}</h3>
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
          <JsonNode data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
