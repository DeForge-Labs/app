"use client";
import { useState, useRef, useEffect } from "react";
import {
  FlaskConical,
  SendHorizonal,
  Bot,
  User,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "That's an interesting question! Let me help you with that.",
          "I understand what you're asking. Here's what I think...",
          "Great question! Based on my understanding, I would say...",
          "Thanks for asking! Here's my perspective on that.",
          "I'd be happy to help you with that inquiry.",
        ];

        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];
        const elaboration = ` Regarding "${userMessage.substring(0, 30)}${
          userMessage.length > 30 ? "..." : ""
        }", I believe this is a topic worth exploring further. Let me know if you need more details!`;

        resolve(randomResponse + elaboration);
      }, 1500 + Math.random() * 1000);
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const aiResponse = await simulateAIResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-2 p-4 pt-0">
      <p className="text-[10px] text-foreground/50 flex items-center gap-1">
        <FlaskConical className="size-3" /> Try it out
      </p>
      <div className="bg-card h-[400px] rounded-md border border-foreground/15 flex flex-col">
        <div
          className={cn(
            "flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col",
            {
              "gap-4": messages.length > 0,
            }
          )}
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-2 border border-dashed rounded-md h-full border-foreground/25 p-10 justify-center text-foreground/40 text-sm">
              <div className="flex items-center p-2 bg-yellow-100 text-yellow-900 rounded-md border border-yellow-500">
                <MessageCircle className="size-6 opacity-50" />
              </div>
              <p className="text-xs">Start a conversation...</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-md border border-foreground/15 py-2 px-3 ${
                  message.role === "user"
                    ? "bg-foreground/90 text-background"
                    : "bg-foreground/5 text-foreground"
                }`}
              >
                <p className="text-xs">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="bg-foreground/5 rounded-lg px-4 py-2">
                <div className="flex gap-1 mt-1">
                  <div
                    className="size-2 rounded-full bg-foreground/40 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="size-2 rounded-full bg-foreground/40 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="size-2 rounded-full bg-foreground/40 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div>
          <div className="flex items-center justify-between px-4 py-2 border-t border-foreground/15 gap-2 z-20 shrink-0">
            <Input
              placeholder="Enter your message..."
              className="w-full px-0 border-0 shadow-none has-focus-visible:border-ring has-focus-visible:ring-[0px] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none ring-0 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <div
              className={`bg-foreground text-background hover:bg-foreground/90 p-2 rounded-md ${
                !input.trim() || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={handleSend}
            >
              <SendHorizonal className="size-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
