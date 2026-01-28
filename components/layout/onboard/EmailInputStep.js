"use client";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmailInputStep({
  email,
  setEmail,
  onSubmit,
  isRequestingLogin,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col rounded-lg border mt-6 border-black/10 shadow-md bg-background dark:bg-foreground/5 dark:border-white/10"
    >
      <p className="mt-5 text-xs dark:text-foreground px-4">
        Enter your email to access your account
      </p>

      <Input
        required
        size="lg"
        type="email"
        value={email}
        variant="outline"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        className="border border-black/10 py-1 before:rounded-sm mt-3 shadow-none dark:border-foreground dark:text-foreground px-1 w-[91%] mx-auto rounded-sm"
      />

      <p className="mt-3 text-xs dark:text-foreground px-4">
        By pressing "Continue", you agree to our{" "}
        <a
          href="https://deforge.io/ToS"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://deforge.io/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Privacy Policy
        </a>
        .
      </p>

      <div className="mt-3 flex w-full">
        <Button
          className="w-full h-11 before:rounded-t-none dark:bg-transparent text-xs border-black/10 dark:disabled:border-white/10 border-x-0 border-b-0 rounded-t-none text-info"
          variant="outline"
          type="submit"
          disabled={isRequestingLogin}
        >
          {isRequestingLogin ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </form>
  );
}
