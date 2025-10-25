"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  BriefcaseBusiness,
  MessageCircle,
  StickyNote,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import DashboardTemplate from "./DashboardTemplate";

export default function DashboardNew() {
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
  return (
    <div className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-6">
      <div className="flex flex-col items-center justify-center gap-2 relative">
        <div className="z-10 flex flex-col gap-2 items-center pt-48 relative">
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full h-full flex items-center justify-center">
            <Image
              src="/logo/logo-outline.svg"
              alt="logo"
              width={400}
              height={400}
              className="opacity-5 dark:invert"
            />
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t  from-background via-background to-background/5"></div>

          <p className="text-3xl text-foreground/80 font-bold z-10">
            What do you want to Automate?
          </p>
          <p className="text-center max-w-lg text-sm text-foreground/60 z-10">
            Create your own AI Agent and automate anything with a simple prompt.
            No coding required.
          </p>

          <div className="relative sm:w-[600px] min-w-[360px] mt-4">
            <Textarea
              placeholder={currentPlaceholder}
              className="w-full border border-foreground/30 rounded-lg h-28 p-2 px-1"
              style={{ resize: "none", fontSize: "16px" }}
            />
            <Button
              className="absolute bottom-2 right-2 rounded-sm p-2 !shadow-none before:!shadow-none"
              onClick={() => {}}
            >
              <ArrowUp />
            </Button>
          </div>

          <div className="flex gap-2 items-center justify-center mt-2">
            <Button
              className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 [&_svg:not([class*='size-'])]:size-3 border border-foreground/20 !px-3 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start text-foreground/60"
              variant="outline"
            >
              <StickyNote />
              Blank workflow
            </Button>

            <Button
              className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 [&_svg:not([class*='size-'])]:size-3 border border-foreground/20 !px-3 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start text-foreground/60"
              variant="outline"
            >
              <MessageCircle />
              Customer Support
            </Button>

            <Button
              className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 [&_svg:not([class*='size-'])]:size-3 border border-foreground/20 !px-3 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start text-foreground/60"
              variant="outline"
            >
              <BriefcaseBusiness />
              Automated Job Finder
            </Button>
          </div>
        </div>

        <DashboardTemplate />
      </div>
    </div>
  );
}
