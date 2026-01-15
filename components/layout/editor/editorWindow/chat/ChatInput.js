"use client";

import { ArrowUp, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Kbd } from "@/components/ui/kbd";
import useChatStore from "@/store/useChatStore";

const items = [
  { label: "Build", value: "build" },
  { label: "Ask", value: "ask" },
];

export default function ChatInput({ onSend, disabled, isLoading }) {
  const textareaRef = useRef(null);
  const [input, setInput] = useState("");
  const { chatMode, setChatMode } = useChatStore();

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
    <div className="flex flex-col gap-2 relative">
      <Textarea
        value={input}
        ref={textareaRef}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        rows={4}
        onChange={(e) => setInput(e.target.value)}
        style={{ resize: "none", fontSize: "12px" }}
        className="w-full border-0 border-t  rounded-none dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none border-foreground/15 rounded-b-lg !bg-background p-2 px-1 pb-11 text-xs placeholder:text-xs"
      />

      <div className="flex items-center justify-between absolute bottom-2 w-full px-2">
        <Select
          items={items}
          defaultValue="build"
          onValueChange={setChatMode}
          value={chatMode}
        >
          <SelectTrigger className="w-24 min-w-24 rounded-sm">
            <SelectValue className={"text-xs"} />
          </SelectTrigger>
          <SelectPopup alignItemWithTrigger={false}>
            {items.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            Press <Kbd className={"text-[10px] bg-foreground/10"}>Enter</Kbd> to
            send
          </div>
          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className=" rounded-sm p-1 min-h-0"
            title="Send"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowUp className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
