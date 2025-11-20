"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, RotateCcw } from "lucide-react";

export default function ChatMessage({ message, onRetry }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isAssistant = message.type === "assistant";
  const isLongMessage = message.content.length > 200;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("[v0] Failed to copy:", err);
    }
  };

  const displayContent = isExpanded
    ? message.content
    : message.content.slice(0, 200);

  return (
    <div
      className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="w-6 h-6 rounded bg-primary/15 flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-bold text-primary">v0</span>
        </div>
      )}

      <div
        className={`flex flex-col gap-2 max-w-[280px] ${
          isAssistant ? "items-start" : "items-end"
        }`}
      >
        {/* Message Bubble */}
        <div
          className={`px-3 py-2 rounded-lg text-sm leading-relaxed break-words ${
            isAssistant
              ? "bg-muted/60 text-foreground border border-border/30"
              : "bg-primary text-primary-foreground"
          }`}
          style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
        >
          <p
            className="text-pretty whitespace-pre-wrap"
            style={{ wordBreak: "break-word" }}
          >
            {displayContent}
          </p>

          {isLongMessage && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className={`mt-2 text-xs font-medium opacity-60 hover:opacity-100 transition-opacity`}
            >
              Show more...
            </button>
          )}

          {isLongMessage && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className={`mt-2 text-xs font-medium opacity-60 hover:opacity-100 transition-opacity`}
            >
              Show less
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={`flex gap-1.5 ${
            isAssistant ? "justify-start" : "justify-end"
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs gap-1 hover:bg-muted/50"
            title="Copy message"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </Button>

          {isAssistant && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="h-7 px-2 text-xs gap-1 hover:bg-muted/50"
              title="Retry this response"
            >
              <RotateCcw className="w-3 h-3" />
              Retry
            </Button>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground/70 px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-bold text-primary-foreground">You</span>
        </div>
      )}
    </div>
  );
}
