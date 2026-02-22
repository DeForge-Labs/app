"use client";

import { Input } from "@/components/ui/input";

export default function PasswordInput({ password, setPassword }) {
  const handleChange = (e) => {
    const value = e.target.value;

    setPassword(value);
  };

  return (
    <>
      <p className="mt-5 text-xs dark:text-foreground px-4">
        Enter your password
      </p>

      <Input
        required
        type="password"
        value={password}
        variant="outline"
        onChange={handleChange}
        placeholder="Enter your password"
        className="border border-black/10 py-1 mb-2 before:rounded-sm mt-2 shadow-none dark:border-foreground dark:text-foreground px-1 w-[91%] mx-auto rounded-sm"
      />
    </>
  );
}
