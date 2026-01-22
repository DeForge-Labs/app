"use client";

import { useState, useMemo } from "react";
import {
  ChevronRight,
  Copy,
  Check,
  Search,
  Hash,
  Type,
  Braces,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function JsonViewer({ data, initialExpandedDepth = 2 }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedKeys, setExpandedKeys] = useState(new Set(["root"]));
  const [copiedPath, setCopiedPath] = useState(null);

  const matchesSearch = (val, term) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();

    if (typeof val !== "object" || val === null) {
      return String(val).toLowerCase().includes(lowerTerm);
    }

    return Object.entries(val).some(
      ([k, v]) => k.toLowerCase().includes(lowerTerm) || matchesSearch(v, term),
    );
  };

  const Highlight = ({ text, term }) => {
    if (!term || !String(text).toLowerCase().includes(term.toLowerCase()))
      return <span>{text}</span>;
    const parts = String(text).split(new RegExp(`(${term})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <mark
              key={i}
              className="bg-yellow-500/30 text-inherit rounded-sm px-0.5"
            >
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  const toggleExpand = (key) => {
    const newExpanded = new Set(expandedKeys);
    newExpanded.has(key) ? newExpanded.delete(key) : newExpanded.add(key);
    setExpandedKeys(newExpanded);
  };

  const copyToClipboard = (text, path) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const getTypeIcon = (value) => {
    if (Array.isArray(value))
      return <List className="w-3 h-3 text-orange-400" />;
    if (value !== null && typeof value === "object")
      return <Braces className="w-3 h-3 text-purple-400" />;
    if (typeof value === "number")
      return <Hash className="w-3 h-3 text-blue-400" />;
    return <Type className="w-3 h-3 text-emerald-400" />;
  };

  const renderValue = (value, keyPath = "root") => {
    const isExpanded =
      expandedKeys.has(keyPath) ||
      (searchTerm && matchesSearch(value, searchTerm));

    if (value === null)
      return <span className="text-gray-500 italic">null</span>;
    if (typeof value === "boolean")
      return (
        <span className="text-orange-500 font-bold">{value.toString()}</span>
      );

    if (typeof value !== "object") {
      const color =
        typeof value === "number" ? "text-blue-400" : "text-emerald-500";
      return (
        <span className={color}>
          {typeof value === "string" && '"'}
          <Highlight text={value} term={searchTerm} />
          {typeof value === "string" && '"'}
        </span>
      );
    }

    const isArray = Array.isArray(value);
    const entries = Object.entries(value);
    const hasChildren = entries.length > 0;

    return (
      <div className="flex flex-col">
        <div
          className="group flex items-center gap-2 py-0.5 px-1 rounded hover:bg-secondary/50 cursor-pointer w-fit"
          onClick={() => hasChildren && toggleExpand(keyPath)}
        >
          {hasChildren && (
            <ChevronRight
              className={cn(
                "w-3.5 h-3.5 transition-transform text-muted-foreground",
                isExpanded && "rotate-90",
              )}
            />
          )}
          <span className="flex items-center gap-1.5 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            {getTypeIcon(value)}
            {isArray ? `Array [${value.length}]` : `Object {${entries.length}}`}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(JSON.stringify(value), keyPath);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded transition-all"
          >
            {copiedPath === keyPath ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-3 pl-3 border-l border-border/50 flex flex-col gap-1 mt-1">
            {entries.map(([k, v], i) => {
              // Filter logic: Only show if the key matches OR its value matches
              if (
                searchTerm &&
                !k.toLowerCase().includes(searchTerm) &&
                !matchesSearch(v, searchTerm)
              )
                return null;

              return (
                <div key={k} className="flex gap-2 items-start">
                  {isArray ? (
                    <span className="text-[10px] bg-secondary px-1 rounded text-muted-foreground mt-1">
                      {i}
                    </span>
                  ) : (
                    <span className="text-purple-400 font-medium">
                      <Highlight text={k} term={searchTerm} />:
                    </span>
                  )}
                  {renderValue(v, `${keyPath}.${k}`)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm font-mono text-sm max-w-full overflow-hidden">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          placeholder="Filter keys or values..."
          className="bg-transparent border-none outline-none text-xs w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </div>
      <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
        {renderValue(data)}
      </div>
    </div>
  );
}
