"use client";

import { useTheme } from "next-themes";

import { MenuRadioGroup, MenuRadioItem } from "@/components/ui/menu";

export default function ThemeRadioButtons() {
  const { theme, setTheme } = useTheme();

  return (
    <MenuRadioGroup value={theme}>
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
