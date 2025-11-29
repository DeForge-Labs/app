"use client";

import { useRef, useState, useEffect } from "react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import AssistantMessageLoading from "./AssistantMessageLoading";
import ChatInput from "./ChatInput";

import useChatStore from "@/store/useChatStore";
import useWorkflowStore from "@/store/useWorkspaceStore";
import useFormStore from "@/store/useFormStore";
import { Button } from "@/components/ui/button";
import { MessageCircle, PanelLeftIcon } from "lucide-react";
import ChatLoader from "./ChatLoader";

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:8000/api";

const ChatModal = () => {
  const scrollRef = useRef(null);
  const { setChatModalOpen } = useChatStore();

  const {
    messages,
    addMessage,
    updateMessage,
    isChatInitializing,
    setIsLoading,
    chatMode,
  } = useChatStore();

  const {
    workflow,
    isWorkspaceInitializing,
    setNodes,
    setConnections,
    setMode,
    nodes,
    connections,
  } = useWorkflowStore();
  const workflowId = workflow?.id;
  const { setComponents, components } = useFormStore();

  const [isResponding, setIsResponding] = useState(false);

  const scrollToBottom = (behavior = "smooth") => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: behavior,
        });
      }, 0);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom("instant");
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages.length]);

  const handleSendMessage = async (inputContent) => {
    if (!inputContent.trim()) return;
    addMessage({
      role: "user",
      content: { type: "text", content: inputContent },
      timestamp: new Date().toISOString(),
    });

    const assistantMsgId = crypto.randomUUID();
    addMessage({
      id: assistantMsgId,
      role: "assistant",
      content: [],
      timestamp: new Date().toISOString(),
      creditsUsed: 0,
      isStreaming: true,
    });

    setIsLoading(true);
    setIsResponding(true);

    try {
      await startStream({
        assistantId: assistantMsgId,
        userMessage: inputContent,
        workflowId,
      });
    } catch (error) {
      console.error("Stream Error:", error);
      updateMessage(assistantMsgId, (prev) => ({
        content: [
          ...prev.content,
          {
            type: "content",
            content: "\n\n**Error:** Failed to connect to the assistant.",
          },
        ],
        isStreaming: false,
      }));
    } finally {
      setIsLoading(false);
      setIsResponding(false);
    }
  };

  const startStream = async ({ assistantId, workflowId, userMessage }) => {
    const abortController = new AbortController();

    const res = await fetch(`${API_BASE}/chat/completion`, {
      method: "POST",
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        workflowId,
        userMessage,
        workflowJSON: {
          nodes: nodes || [],
          connections: connections || [],
          components: components || [],
        },
        mode: chatMode,
        modelName: "minimax/minimax-m2",
      }),
    });

    if (!res.ok) throw new Error("Failed streaming start");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const raw = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 2);

        const lines = raw.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const jsonStr = line.replace("data:", "").trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const data = JSON.parse(jsonStr);
            handleStreamAction(assistantId, data);
          } catch (e) {
            console.error("Bad JSON in stream:", e);
          }
        }
      }
    }

    if (buffer.trim()) {
      try {
        const cleanBuffer = buffer.replace("data:", "").trim();
        if (cleanBuffer && cleanBuffer !== "[DONE]") {
          handleStreamAction(assistantId, JSON.parse(cleanBuffer));
        }
      } catch (_) {}
    }

    handleStreamAction(assistantId, { type: "completion" });
  };

  const handleStreamAction = (msgId, data) => {
    if (!data.type) return;

    let nodes = [];
    let connections = [];
    let components = [];

    switch (data.type) {
      case "tool":
      case "context":
        updateMessage(msgId, (prev) => ({
          content: [
            ...prev.content,
            { type: data.type, content: data.content },
          ],
        }));
        scrollToBottom("smooth");
        break;

      case "content":
        updateMessage(msgId, (prev) => {
          const lastIdx = prev.content.length - 1;
          const lastItem = prev.content[lastIdx];
          if (lastItem && lastItem.type === "content") {
            const newContentList = [...prev.content];
            newContentList[lastIdx] = {
              ...lastItem,
              content: lastItem.content + data.content,
            };
            return { content: newContentList };
          }
          return {
            content: [
              ...prev.content,
              { type: "content", content: data.content },
            ],
          };
        });
        scrollToBottom("smooth");
        break;

      case "workflow_editor":
        setMode("workflow");

        nodes = data.data.nodes;
        connections = data.data.connections;
        components = data.data.components;
        setNodes(nodes);
        setConnections(connections);
        setComponents(components);

        break;

      case "workflow_form":
        setMode("form");
        nodes = data.data.nodes;
        connections = data.data.connections;
        components = data.data.components;
        setNodes(nodes);
        setConnections(connections);
        setComponents(components);

        break;

      case "workflow_json":
        const workflowJSON = JSON.parse(data.data);
        setNodes(workflowJSON.nodes);
        setConnections(workflowJSON.connections);
        setComponents(workflowJSON.components);

        break;

      case "completion":
        updateMessage(msgId, { isStreaming: false });
        break;

      case "error":
        updateMessage(msgId, (prev) => ({
          content: [
            ...prev.content,
            { type: "content", content: `\n> Error: ${data.message}` },
          ],
          isStreaming: false,
        }));
        scrollToBottom("smooth");
        break;

      default:
        console.warn("Unknown stream type:", data.type);
    }
  };

  return (
    <div className="w-[400px] flex flex-col pr-2 h-full">
      <div className="flex flex-1 flex-col border border-foreground/15 bg-background rounded-md h-full">
        <div className="flex gap-2 text-sm border-b border-foreground/15 p-4 relative z-20 shrink-0 justify-between items-center">
          <div className="flex gap-2">
            <MessageCircle className="size-4 mt-1" />
            <div className="flex flex-col">
              <p>Chat</p>
              <p className="text-xs text-muted-foreground">
                Build your workflows using Assistant
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-xs [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='size-'])]:opacity-50 border border-foreground/20 bg-card/30 rounded-sm h-[28px] w-7 mr-1"
            onClick={() => setChatModalOpen(false)}
          >
            <PanelLeftIcon />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {isWorkspaceInitializing || isChatInitializing ? (
            <ChatLoader />
          ) : null}
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto custom-scrollbar px-2 py-4 space-y-4 scroll-smooth"
          >
            {messages?.map((message) => {
              const key = message.id || Math.random();

              if (message?.role === "user") {
                return <UserMessage key={key} message={message} />;
              }

              if (message?.role === "assistant") {
                if (message.isStreaming) {
                  return (
                    <AssistantMessageLoading key={key} message={message} />
                  );
                }
                return <AssistantMessage key={key} message={message} />;
              }
              return null;
            })}
          </div>
        </div>

        <div className="">
          <ChatInput
            onSend={handleSendMessage}
            isLoading={isResponding}
            disabled={
              isResponding || isWorkspaceInitializing || isChatInitializing
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
