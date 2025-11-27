"use client";

import { ArrowUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ChatInput({ onSend, disabled }) {
  const textareaRef = useRef(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = Math.min(textareaRef.current.scrollHeight, 140);
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 relative">
      <Textarea
        value={input}
        ref={textareaRef}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        onChange={(e) => setInput(e.target.value)}
        style={{ resize: "none", fontSize: "12px" }}
        className="w-full border border-foreground/30 rounded-lg p-2 px-1 text-xs placeholder:text-xs"
      />

      <Button
        onClick={handleSend}
        disabled={disabled}
        className="absolute bottom-2 right-2 rounded-sm p-1 min-h-0"
        title="Send"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
