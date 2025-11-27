"use client";

import Image from "next/image";
import { useState } from "react";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";

const ChatMessage = ({ message }) => {
  if (!message?.content || message.content.trim() === "") return null;

  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isAssistant = message.type === "assistant";
  const isStreaming = !!message.streaming;
  const isLongMessage = message.content.length > 250;

  const displayedText = isExpanded
    ? message.content
    : message.content.slice(0, 250);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1800);
  };

  return (
    <div
      className={`flex flex-col w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isAssistant ? "items-start" : "items-end"
      }`}
    >
      {isAssistant && (
        <div className="flex items-center gap-2 mb-1">
          <div className="rounded-full border border-border shadow-sm overflow-hidden p-1.5 bg-background">
            <Image
              width={16}
              height={16}
              alt="assistant"
              src="/logo/logo-white.svg"
            />
          </div>

          {isStreaming && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground animate-pulse">
              <span>Thinking</span>
              <span className="inline-block w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
            </div>
          )}
        </div>
      )}

      <div
        className={`relative max-w-[280px] px-3 py-2 rounded-lg text-xs shadow-sm 
          whitespace-pre-wrap wrap-break-words
          ${
            isAssistant
              ? "bg-muted/70 text-foreground border border-border/30"
              : "bg-primary text-primary-foreground"
          }
        `}
      >
        <div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="last:mb-0 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc ml-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-4">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="leading-snug">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="px-1 py-0.5 bg-black/10 rounded text-[11px]">
                    {children}
                  </code>
                ) : (
                  <pre className="p-2 mb-2 bg-black/10 rounded text-[11px] overflow-x-auto">
                    <code>{children}</code>
                  </pre>
                ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  className="underline text-blue-600"
                >
                  {children}
                </a>
              ),
            }}
          >
            {displayedText}
          </ReactMarkdown>

          {isLongMessage && !isStreaming && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[10px] opacity-60 hover:opacity-100 mt-2 cursor-pointer"
            >
              {isExpanded ? "Show less" : "Show more..."}
            </button>
          )}
        </div>

        <span className="block text-[10px] opacity-70 text-right">
          {message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </span>

        {isStreaming && (
          <span className="block mt-1 text-[10px] opacity-80">
            • Streaming…"
          </span>
        )}
      </div>

      <div
        className={`flex w-full mt-2 ${
          isAssistant ? "justify-start pl-1" : "justify-end pr-1"
        }`}
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          disabled={isStreaming}
          className="h-7 px-2 text-[10px] gap-1 hover:bg-muted/50"
        >
          {isCopied ? (
            <>
              <Check className="w-3! h-3!" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3! h-3!" /> Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatMessage;
