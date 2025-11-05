"use client";

import { Input } from "@/components/ui/input";

const MAX_USERNAME_LENGTH = 20;

export default function UsernameInput({ username, setUsername }) {
  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length <= MAX_USERNAME_LENGTH) {
      setUsername(value);
    }
  };

  return (
    <>
      <p className="mt-5 text-xs dark:text-foreground px-4">
        What should we call you?
      </p>

      <Input
        required
        type="text"
        value={username}
        variant="outline"
        onChange={handleChange}
        maxLength={MAX_USERNAME_LENGTH}
        placeholder="Enter your username"
        className="border border-black/10 py-1 before:rounded-sm mt-2 shadow-none dark:border-foreground dark:text-foreground px-1 w-[91%] mx-auto rounded-sm"
      />
    </>
  );
}
