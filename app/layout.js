import { Lexend_Deca } from "next/font/google";

import "./globals.css";

import UiProvider from "@/providers/UiProvider";

import { Toaster } from "sonner";
import ReduxProvider from "@/providers/ReduxProvider";

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
          <UiProvider>
            <Toaster
              position="bottom-center"
              richColors
              toastOptions={{
                className: `flex items-center justify-center text-center border border-black ${lexendDeca.className}`,
                style: {
                  color: "black",
                  backgroundColor: "var(--background)",
                  borderColor: "black",
                },
              }}
            />
            {children}
          </UiProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
