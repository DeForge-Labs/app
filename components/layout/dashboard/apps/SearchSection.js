"use client";

import { Loader2, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";

import { Input } from "@/components/ui/input";

const DEBOUNCE_DELAY = 500;

export default function SearchSection({
  route = "apps",
  placeholder = "Search apps...",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const isFirstRender = useRef(true);

  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(() => searchParams.get("q") || "");

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";

    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsLoading(true);

    timerRef.current = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        newParams.set("q", query.trim());
      } else {
        newParams.delete("q");
      }

      newParams.delete("p");

      const queryString = newParams.toString();
      const url = `/${route}${queryString ? `?${queryString}` : ""}`;

      router.push(url, { scroll: false });
      setIsLoading(false);
    }, DEBOUNCE_DELAY);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        setIsLoading(false);
      }
    };
  }, [query, router, route, searchParams]);

  const handleChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-foreground/15 gap-2">
      {isLoading ? (
        <Loader2
          aria-hidden="true"
          className="w-4 h-4 opacity-50 animate-spin"
        />
      ) : (
        <Search className="w-4 h-4 opacity-50" aria-hidden="true" />
      )}

      <Input
        type="search"
        value={query}
        ref={inputRef}
        onChange={handleChange}
        aria-label={placeholder}
        placeholder={placeholder}
        className="w-full px-0 border-0 shadow-none has-focus-visible:border-ring has-focus-visible:ring-0 not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none ring-0 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
      />
    </div>
  );
}
