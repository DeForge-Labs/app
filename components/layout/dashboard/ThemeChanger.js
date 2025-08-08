"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function ThemeChanger({ className }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "border border-black/50 px-2 h-8 rounded-lg text-black/80 text-xs dark:text-background dark:border-background",
        className
      )}
      onPress={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
    >
      {resolvedTheme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
    </Button>
  );
}
