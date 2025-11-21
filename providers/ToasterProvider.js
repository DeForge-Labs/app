"use client";

import { Toaster } from "sonner";
import { Lexend_Deca } from "next/font/google";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["variable"],
});

export default function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      toastOptions={{
        className: `flex items-center justify-center text-center border ${lexendDeca.className}`,
        style: {
          backgroundColor: "var(--card)",
          color: "var(--foreground)",
          borderColor: "var(--muted-foreground)",
          borderRadius: "6px",
          fontSize: "12px",
          padding: "15px",
        },
      }}
    />
  );
}
