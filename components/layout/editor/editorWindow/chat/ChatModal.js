"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import useChatStore from "@/store/useChatStore";
import { Loader2 } from "lucide-react";

const SCROLL_THRESHOLD = 150;
const GRADIENT_HEIGHT = 40; // Height of the gradient fade effect

export default function ChatModal() {
  const { messages, addMessage, prependMessages, hasMoreMessages } =
    useChatStore();
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const isLoadingMoreRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);
  const previousScrollHeightRef = useRef(0);

  useEffect(() => {
    if (!scrollRef.current || !shouldAutoScrollRef.current) return;

    requestAnimationFrame(() => {
      const element = scrollRef.current;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }, [messages.length]);

  const handleScroll = useCallback(
    (e) => {
      const element = e.target;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;

      setScrollPosition(scrollTop);

      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      shouldAutoScrollRef.current = isNearBottom;

      if (
        scrollTop < SCROLL_THRESHOLD &&
        !isLoadingMoreRef.current &&
        hasMoreMessages
      ) {
        isLoadingMoreRef.current = true;
        setLocalLoading(true);
        shouldAutoScrollRef.current = false;

        // Store scroll height before loading new messages
        previousScrollHeightRef.current = scrollHeight;

        setTimeout(() => {
          const mockOlderMessages = Array.from({ length: 10 }, (_, i) => ({
            id: `old-${Date.now()}-${i}`,
            type: i % 2 === 0 ? "user" : "assistant",
            content: `Previous message ${
              i + 1
            }. This is a mock older message loaded from history.`,
            timestamp: new Date(Date.now() - (10 + i) * 60000),
          }));

          prependMessages(mockOlderMessages);

          requestAnimationFrame(() => {
            if (scrollRef.current) {
              const newScrollHeight = scrollRef.current.scrollHeight;
              const heightAdded =
                newScrollHeight - previousScrollHeightRef.current;
              scrollRef.current.scrollTop = scrollTop + heightAdded;
            }
            setLocalLoading(false);
            isLoadingMoreRef.current = false;
          });
        }, 600);
      }
    },
    [hasMoreMessages, prependMessages]
  );

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    shouldAutoScrollRef.current = true; // Enable auto-scroll for new messages

    setLocalLoading(true);
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I'll help you with: "${content}". This is a simulated response. Connect your AI service to get real responses.`,
        timestamp: new Date(),
      };
      addMessage(assistantMessage);
      setLocalLoading(false);
    }, 1000);
  };

  const handleRetry = (messageId) => {
    console.log("[v0] Retry message:", messageId);
  };

  const gradientOpacity = Math.min(
    1,
    Math.max(0, (GRADIENT_HEIGHT - scrollPosition) / GRADIENT_HEIGHT)
  );

  return (
    <div className="w-[400px] flex flex-col h-full bg-background border-r border-border/50 overflow-hidden">
      {/* Header - Fixed, no fade */}
      <div className="px-4 py-3 border-b border-border/50 bg-background shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Chat</h2>
        <p className="text-xs text-muted-foreground">
          Ask anything about your project
        </p>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {/* Gradient fade overlay - appears when messages scroll up */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-10 transition-opacity duration-200"
          style={{
            height: `${GRADIENT_HEIGHT}px`,
            background: `linear-gradient(to bottom, rgba(var(--background-rgb), 1) 0%, rgba(var(--background-rgb), 0.8) 50%, rgba(var(--background-rgb), 0) 100%)`,
            opacity: gradientOpacity,
          }}
        />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
        >
          {/* Loading indicator for older messages */}
          {localLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />
              <span className="text-xs text-muted-foreground">
                Loading earlier messages...
              </span>
            </div>
          )}

          {/* Empty state */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No messages yet
              </p>
              <p className="text-xs text-muted-foreground">
                Start a conversation by typing a message
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRetry={() => handleRetry(message.id)}
              />
            ))
          )}

          {/* Typing indicator when assistant is responding */}
          {localLoading && messages.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-primary/15 flex items-center justify-center mt-1 shrink-0">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-2 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-2 bg-muted rounded w-1/2 animate-pulse" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-border/50 bg-background p-4 shrink-0">
        <ChatInput onSend={handleSendMessage} disabled={localLoading} />
      </div>
    </div>
  );
}
