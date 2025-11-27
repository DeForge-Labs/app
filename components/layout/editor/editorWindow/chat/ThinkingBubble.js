"use client";

import { useEffect, useState } from "react";

export default function ThinkingBubble({ active }) {
  const [seconds, setSeconds] = useState(0);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (!active) {
      setSeconds(0);
      setDots(0);
      return;
    }

    const secInterval = setInterval(() => setSeconds((s) => s + 1), 1000);
    const dotsInterval = setInterval(() => setDots((d) => (d + 1) % 4), 300);

    return () => {
      clearInterval(secInterval);
      clearInterval(dotsInterval);
    };
  }, [active]);

  const ellipsis = ".".repeat(dots);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="font-medium">Thinking{ellipsis}</span>
      <span className="opacity-60">• {seconds}s</span>
    </div>
  );
}
