"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ThinkingBubble from "./ThinkingBubble";

import useChatStore from "@/store/useChatStore";
import useSocket from "@/hooks/useSocket";

import { Loader2 } from "lucide-react";
import useWorkflowStore from "@/store/useWorkspaceStore";

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:8000/api";

const NEAR_BOTTOM_THRESHOLD = 150;

const ChatModal = ({ sessionId = null }) => {
  const scrollRef = useRef(null);

  const { messages, addMessage, updateMessage, setMessages, setWorkflowJSON } =
    useChatStore();
  const { workflow } = useWorkflowStore();

  const workflowId = workflow?.id;

  const { socket, subscribeToWorkflow, unsubscribeFromWorkflow } = useSocket();

  const [isResponding, setIsResponding] = useState(false);
  const [thinkingActive, setThinkingActive] = useState(false);
  const [currentAssistantId, setCurrentAssistantId] = useState(null);
  const [streamController, setStreamController] = useState(null);

  const shouldAutoScrollRef = useRef(true);

  /* -----------------------------------------------------
     🟦 1. Socket subscription (NO initializeWebSocket)
  ----------------------------------------------------- */
  useEffect(() => {
    if (!socket) return;

    console.log("%c[ChatModal] Socket ready, subscribing...", "color: #4ade80");

    subscribeToWorkflow(workflowId);

    const handleWorkflow = (payload) => {
      if (payload?.workflowJSON) {
        setWorkflowJSON(payload.workflowJSON);
      }
    };

    socket.on("workflow_generation", handleWorkflow);

    return () => {
      try {
        socket.off("workflow_generation", handleWorkflow);
        unsubscribeFromWorkflow(workflowId);
      } catch (_) {}
    };
  }, [
    socket,
    workflowId,
    subscribeToWorkflow,
    unsubscribeFromWorkflow,
    setWorkflowJSON,
  ]);

  /* -----------------------------------------------------
     🟦 2. Load initial chat history
  ----------------------------------------------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!workflowId) return;

        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE}/chat/history/${workflowId}?page=1&limit=10`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        if (!mounted) return;

        const history = (data.messages || []).map((m, i) => ({
          id: `hist-${i}-${m.timestamp}`,
          type: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
          timestamp: new Date(m.timestamp),
        }));

        setMessages(history);
      } catch (err) {
        console.error("[ChatModal] Failed loading history", err);
      }
    })();

    return () => (mounted = false);
  }, [workflowId, setMessages]);

  /* -----------------------------------------------------
     🟦 3. Smooth autoscroll
  ----------------------------------------------------- */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (!shouldAutoScrollRef.current) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const nearBottom =
        scrollHeight - scrollTop - clientHeight < NEAR_BOTTOM_THRESHOLD;
      shouldAutoScrollRef.current = nearBottom;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* -----------------------------------------------------
     🟦 4. Create streaming assistant message placeholder
  ----------------------------------------------------- */
  const createAssistantStreamingMessage = useCallback(() => {
    const id = `tmp-${Date.now()}`;
    addMessage({
      id,
      type: "assistant",
      content: "",
      timestamp: new Date(),
      streaming: true,
      error: false,
    });
    return id;
  }, [addMessage]);

  /* -----------------------------------------------------
     🟦 5. Handle sending message
  ----------------------------------------------------- */
  const handleSendMessage = async (content) => {
    addMessage({
      id: `u-${Date.now()}`,
      type: "user",
      content,
      timestamp: new Date(),
    });

    const assistantId = createAssistantStreamingMessage();
    setCurrentAssistantId(assistantId);
    setIsResponding(true);
    setThinkingActive(true);

    try {
      const controller = await startStream({
        assistantId,
        userMessage: content,
        workflowId,
        sessionId,
      });

      setStreamController(controller);
    } catch (err) {
      updateMessage(assistantId, {
        streaming: false,
        error: true,
        content: "Failed to start streaming.",
      });

      setIsResponding(false);
      setThinkingActive(false);
    }
  };

  /* -----------------------------------------------------
     🟦 6. Retry logic
  ----------------------------------------------------- */
  const handleRetry = async (assistantMessageId) => {
    const index = messages.findIndex((m) => m.id === assistantMessageId);
    if (index === -1) return;

    let previousUserContent = "";
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].type === "user") {
        previousUserContent = messages[i].content;
        break;
      }
    }

    updateMessage(assistantMessageId, {
      streaming: true,
      error: false,
      content: "",
      timestamp: new Date(),
    });

    setCurrentAssistantId(assistantMessageId);
    setIsResponding(true);
    setThinkingActive(true);

    try {
      const ctrl = await startStream({
        assistantId: assistantMessageId,
        userMessage: previousUserContent,
        workflowId,
        sessionId,
      });

      setStreamController(ctrl);
    } catch (err) {
      updateMessage(assistantMessageId, {
        streaming: false,
        error: true,
        content: "Retry failed.",
      });

      setIsResponding(false);
      setThinkingActive(false);
    }
  };

  /* -----------------------------------------------------
     🟦 7. Streaming: POST /chat/completion
         Parses "data: {json}\n\n" chunks
  ----------------------------------------------------- */
  const startStream = async ({
    assistantId,
    workflowId,
    userMessage,
    sessionId,
  }) => {
    const abortController = new AbortController();
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/chat/completion`, {
      method: "POST",
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({
        workflowId,
        userMessage,
        sessionId: sessionId || `session-${Date.now()}`,
        workflowJSON: {},
        modelName: "minimax/minimax-m2",
      }),
    });

    if (!res.ok) {
      throw new Error("Failed streaming start");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    const pump = async () => {
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          let idx;
          while ((idx = buffer.indexOf("\n\n")) !== -1) {
            const raw = buffer.slice(0, idx).trim();
            buffer = buffer.slice(idx + 2);

            for (const line of raw.split("\n")) {
              if (!line.startsWith("data:")) continue;

              const json = line.replace("data:", "").trim();
              try {
                handleChunk(JSON.parse(json), assistantId);
              } catch (e) {
                handleChunk(
                  { type: "error", message: "Bad JSON" },
                  assistantId
                );
              }
            }
          }
        }

        if (buffer.trim()) {
          try {
            handleChunk(
              JSON.parse(buffer.replace("data:", "").trim()),
              assistantId
            );
          } catch (_) {}
        }

        handleChunk({ type: "completion" }, assistantId);
      } catch (err) {
        handleChunk({ type: "error", message: err.message }, assistantId);
      }
    };

    pump();

    return {
      abort: () => abortController.abort(),
    };
  };

  /* -----------------------------------------------------
     🟦 8. Handle each chunk
  ----------------------------------------------------- */
  const handleChunk = useCallback(
    (event, assistantId) => {
      if (!event?.type) return;

      if (event.type === "content") {
        updateMessage(assistantId, (prev) => ({
          content: (prev.content || "") + event.content,
        }));
      }

      if (event.type === "workflowJSON") {
        try {
          setWorkflowJSON(JSON.parse(event.data));
        } catch (_) {}
      }

      if (event.type === "completion") {
        updateMessage(assistantId, { streaming: false });
        setIsResponding(false);
        setThinkingActive(false);
      }

      if (event.type === "error") {
        updateMessage(assistantId, {
          streaming: false,
          error: true,
          content: event.message || "Stream error",
        });
        setIsResponding(false);
        setThinkingActive(false);
      }
    },
    [updateMessage, setWorkflowJSON]
  );

  /* -----------------------------------------------------
     🟦 9. UI
  ----------------------------------------------------- */
  return (
    <div className="w-[400px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-2 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Chat</h2>
            <p className="text-xs text-muted-foreground">
              Ask anything about your project
            </p>
          </div>

          {thinkingActive && <ThinkingBubble active />}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto px-2 py-4 space-y-4"
        >
          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              onRetry={() => handleRetry(m.id)}
            />
          ))}

          {isResponding && (
            <div className="flex gap-4 items-center">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">
                Assistant is writing…
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-2">
        <ChatInput onSend={handleSendMessage} disabled={isResponding} />
      </div>
    </div>
  );
};

export default ChatModal;
