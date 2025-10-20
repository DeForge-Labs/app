"use client";

import { Headset, StickyNote } from "lucide-react";

export default function StartContainer({ children }) {
  return (
    <div className="flex flex-col min-h-screen w-screen justify-between dark:bg-dark">
      <div
        className="absolute w-96 h-96 rounded-full opacity-10 -z-10 dark:hidden"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          top: "20%",
          left: "20%",
        }}
      />

      <div
        className="absolute w-96 h-96 rounded-full opacity-10 -z-10 dark:hidden"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          bottom: "20%",
          right: "20%",
        }}
      />
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="relative max-w-full flex flex-col items-center justify-center pt-24">
          {children}
        </div>
      </div>
      <div className="flex items-center justify-center text-black/60 gap-3 py-8 px-4 dark:text-foreground">
        <div
          className="flex gap-1 items-center hover:cursor-pointer hover:text-black/80 dark:hover:text-foreground/80"
          onClick={() => window.open("https://docs.deforge.io", "_blank")}
        >
          <StickyNote className="w-3 h-3" />
          <p className="text-xs">Docs</p>
        </div>
        <div
          className="flex gap-1 items-center hover:cursor-pointer hover:text-black/80 dark:hover:text-foreground/80 dark:text-foreground"
          onClick={() =>
            window.open("https://cal.com/anoy-deforge/30min", "_blank")
          }
        >
          <Headset className="w-3 h-3" />
          <p className="text-xs">Contact Us</p>
        </div>
      </div>
    </div>
  );
}
