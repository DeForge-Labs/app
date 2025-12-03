"use client";

import { Loader2, Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";

const DEBOUNCE_DELAY = 500;

export default function SearchSection({ placeholder = "Search apps..." }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const [query, setQuery] = useState(() => searchParams.get("q") || "");

  const previousUrlQuery = useRef(searchParams.get("q") || "");
  const timerRef = useRef(null);

  useEffect(() => {
    const currentUrlQuery = searchParams.get("q") || "";

    if (currentUrlQuery !== previousUrlQuery.current) {
      setQuery(currentUrlQuery);
      previousUrlQuery.current = currentUrlQuery;
    }
  }, [searchParams]);

  useEffect(() => {
    const currentUrlQuery = searchParams.get("q") || "";
    if (query === currentUrlQuery) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    setIsLoading(true);

    timerRef.current = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        newParams.set("q", query.trim());
      } else {
        newParams.delete("q");
      }

      newParams.delete("p");

      previousUrlQuery.current = query.trim();

      const queryString = newParams.toString();
      const url = `${pathname}${queryString ? `?${queryString}` : ""}`;

      router.push(url, { scroll: false });
      setIsLoading(false);
    }, DEBOUNCE_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, pathname, router, searchParams]);

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
        onChange={handleChange}
        aria-label={placeholder}
        placeholder={placeholder}
        className="w-full px-0 border-0 shadow-none focus-visible:ring-0 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
      />
    </div>
  );
}
