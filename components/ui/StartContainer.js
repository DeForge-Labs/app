import Link from "next/link";
import { Headset, StickyNote } from "lucide-react";

const FooterLink = ({ href, icon, label }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-1 items-center text-xs transition-colors hover:text-black/80 dark:hover:text-foreground/80"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const StartContainer = ({ children }) => {
  return (
    <div className="relative flex flex-col min-h-screen w-screen justify-between dark:bg-dark">
      <div
        className="absolute w-96 h-96 rounded-full opacity-10 -z-10 dark:hidden"
        style={{
          top: "20%",
          left: "20%",
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute w-96 h-96 rounded-full opacity-10 -z-10 dark:hidden"
        style={{
          right: "20%",
          bottom: "20%",
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
        }}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center pt-24">
          {children}
        </div>
      </main>

      <footer className="flex items-center justify-center gap-3 py-8 px-4 text-black/60 dark:text-foreground">
        <FooterLink
          label="Docs"
          href="https://docs.deforge.io"
          icon={<StickyNote className="w-3 h-3" />}
        />

        <FooterLink
          label="Contact Us"
          icon={<Headset className="w-3 h-3" />}
          href="https://cal.com/anoy-deforge/30min"
        />
      </footer>
    </div>
  );
};

export default StartContainer;
