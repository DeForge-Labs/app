"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useWorkflow from "@/hooks/useCreateWorkflow";
import { useSearchParams } from "next/navigation";
import BlankWorkflowDialog from "./BlankWorkflowDialog";
import { StickyNote, MessageCircle, BriefcaseBusiness } from "lucide-react";

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
  const searchParams = useSearchParams();

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
      isDeleting ? 30 : 50,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex, placeholders]);

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt) setPrompt(prompt);
  }, [searchParams]);

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
    <>
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

      <div className="flex gap-2 items-center justify-center mt-2">
        <BlankWorkflowDialog
          render={
            <Button
              className="flex gap-2 bg-blue-50 dark:bg-blue-900/20 border-blue-500 border-dashed font-normal border !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 [&_svg:not([class*='size-'])]:size-3 !px-3 rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start text-blue-500 dark:text-blue-500"
              variant="outline"
            >
              <StickyNote />
              Blank workflow
            </Button>
          }
        />

        <Button
          className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 [&_svg:not([class*='size-'])]:size-3 border border-foreground/20 !px-3 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start text-foreground/60"
          variant="outline"
          onClick={() => {
            setPrompt(
              "Create a customer support agent that knows your business inside and out, based on the documents I upload.",
            );
          }}
        >
          <MessageCircle />
          Customer Support
        </Button>

        <Button
          className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 [&_svg:not([class*='size-'])]:size-3 border border-foreground/20 !px-3 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start text-foreground/60"
          variant="outline"
          onClick={() => {
            setPrompt(
              "Create a workflow that finds me the best job opportunities.",
            );
          }}
        >
          <BriefcaseBusiness />
          Automated Job Finder
        </Button>
      </div>
    </>
  );
}
