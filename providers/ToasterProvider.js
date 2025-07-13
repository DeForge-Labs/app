"use client";

import { Toaster } from "sonner";
import { Lexend_Deca } from "next/font/google";
import { useTheme } from "next-themes";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["variable"],
});

export default function ToasterProvider() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-center"
      richColors
      toastOptions={{
        className: `flex items-center justify-center text-center border border-black dark:border-background ${lexendDeca.className}`,
        style: {
          color: resolvedTheme === "dark" ? "white" : "black",
          backgroundColor:
            resolvedTheme === "dark" ? "var(--dark)" : "var(--background)",
          borderColor: resolvedTheme === "dark" ? "white" : "black",
        },
      }}
    />
  );
}
