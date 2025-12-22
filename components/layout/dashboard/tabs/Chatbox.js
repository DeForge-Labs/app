"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useWorkflow from "@/hooks/useCreateWorkflow";

export default function Chatbox() {
  const placeholders = [
    "Create an AI Chatbot which teaches me to code",
    "Build an agent that summarizes my emails daily",
    "Make a bot that tracks competitor pricing",
    "Create an assistant that schedules meetings",
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prompt, setPrompt] = useState("");

  const { isCreatingWorkflow, handleCreateWorkflow } = useWorkflow();

  useEffect(() => {
    const currentText = placeholders[placeholderIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentText.length) {
            setCurrentPlaceholder(currentText.slice(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (charIndex > 0) {
            setCurrentPlaceholder(currentText.slice(0, charIndex - 1));
            setCharIndex(charIndex - 1);
          } else {
            setIsDeleting(false);
            setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
          }
        }
      },
      isDeleting ? 30 : 50
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex, placeholders]);

  const onSubmit = () => {
    if (!prompt.trim() || isCreatingWorkflow) return;
    handleCreateWorkflow(prompt, "blank", true, true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      className="relative sm:w-[600px] min-w-[360px] mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Textarea
        placeholder={currentPlaceholder}
        className="w-full border border-foreground/30 rounded-lg h-28 p-2 px-1"
        style={{ resize: "none", fontSize: "14px" }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        className="absolute bottom-2 right-2 rounded-sm p-2 !shadow-none before:!shadow-none"
        type="submit"
        disabled={isCreatingWorkflow || !prompt.trim()}
      >
        {isCreatingWorkflow ? (
          <Loader2 className="animate-spin" />
        ) : (
          <ArrowUp />
        )}
      </Button>
    </form>
  );
}
