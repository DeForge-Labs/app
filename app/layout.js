import { Lexend_Deca } from "next/font/google";

import "./globals.css";

import UiProvider from "@/providers/UiProvider";

import ReduxProvider from "@/providers/ReduxProvider";
import { ThemeProvider } from "next-themes";
import ToasterProvider from "@/providers/ToasterProvider";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["variable"],
});

export const metadata = {
  title: "Deforge.io",
  description: "Build AI Agents Visually, No Code Required",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lexendDeca.className} antialiased`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <ThemeProvider attribute="class">
            <UiProvider>
              <ToasterProvider />
              {children}
            </UiProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
