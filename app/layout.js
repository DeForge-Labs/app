import { Lexend_Deca } from "next/font/google";

import "./globals.css";

import ReduxProvider from "@/providers/ReduxProvider";
import { ThemeProvider } from "next-themes";
import ToasterProvider from "@/providers/ToasterProvider";

import Script from "next/script";

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
      <script
        async
        src="https://scripts.simpleanalyticscdn.com/latest.js"
      ></script>
      <body
        className={`${lexendDeca.className} antialiased`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <ThemeProvider attribute="class">
            <ToasterProvider />
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
