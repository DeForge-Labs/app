"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";

export default function ThemeChanger() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="border border-black/50 px-4 h-9 rounded-lg text-black/80 text-xs dark:text-background dark:border-background"
      onPress={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
    >
      {resolvedTheme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
    </Button>
  );
}
