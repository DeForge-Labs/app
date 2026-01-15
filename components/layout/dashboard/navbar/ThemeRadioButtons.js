"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MenuRadioGroup, MenuRadioItem } from "@/components/ui/menu";

export default function ThemeRadioButtons() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <MenuRadioGroup value={theme} onValueChange={setTheme}>
      <MenuRadioItem value="dark" onClick={() => setTheme("dark")}>
        Dark
      </MenuRadioItem>

      <MenuRadioItem value="light" onClick={() => setTheme("light")}>
        Light
      </MenuRadioItem>

      <MenuRadioItem value="system" onClick={() => setTheme("system")}>
        System
      </MenuRadioItem>
    </MenuRadioGroup>
  );
}
