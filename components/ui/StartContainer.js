"use client";

import { Headset, StickyNote } from "lucide-react";

export default function StartContainer({ children }) {
  return (
    <div className="flex flex-col min-h-screen w-screen justify-between dark:bg-dark">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="relative max-w-full flex flex-col items-center justify-center pt-24">
          {children}
        </div>
      </div>
      <div className="flex items-center justify-center text-black/60 gap-3 py-8 px-4 dark:text-background">
        <div
          className="flex gap-1 items-center hover:cursor-pointer hover:text-black/80 dark:hover:text-background"
          onClick={() => window.open("https://docs.deforge.io", "_blank")}
        >
          <StickyNote className="w-4 h-4" />
          <p className="text-sm">Docs</p>
        </div>
        <div
          className="flex gap-1 items-center hover:cursor-pointer hover:text-black/80 dark:hover:text-background dark:text-background"
          onClick={() =>
            window.open("https://cal.com/anoy-deforge/30min", "_blank")
          }
        >
          <Headset className="w-4 h-4" />
          <p className="text-sm">Contact Us</p>
        </div>
      </div>
    </div>
  );
}
