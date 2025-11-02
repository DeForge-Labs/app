"use client";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";

export default function SearchSection({
  route = "apps",
  placeholder = "Search apps...",
}) {
  const inputRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const timerRef = useRef(null);
  const isFirstRender = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setQuery(urlQuery);
  }, [searchParams]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      setIsLoading(false);
    }

    if (params?.id) {
      setIsLoading(true);

      timerRef.current = setTimeout(() => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (query) {
          newParams.set("q", query);
        } else {
          newParams.delete("q");
        }

        newParams.delete("p");

        const queryString = newParams.toString();
        const url = `/dashboard/${params.id}/${route}${
          queryString ? `?${queryString}` : ""
        }`;

        router.push(url);
        setIsLoading(false);
      }, 500);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        setIsLoading(false);
      }
    };
  }, [query, params?.id, router, searchParams]);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-foreground/15 gap-2">
      {isLoading ? (
        <Loader2 className="w-4 h-4 opacity-50 animate-spin" />
      ) : (
        <Search className="w-4 h-4 opacity-50" />
      )}
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-0 border-0 shadow-none has-focus-visible:border-ring has-focus-visible:ring-[0px] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none ring-0 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
      />
    </div>
  );
}
