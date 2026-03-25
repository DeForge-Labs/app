"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, X, ChevronRight, Loader2 } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || "",
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUrlQuery = searchParams.get("q") || "";
    if (searchQuery !== currentUrlQuery) {
      setSearchQuery(currentUrlQuery);
    }

    setIsLoading(false);
  }, [searchParams]);

  const handleSearch = useCallback(() => {
    const currentUrlQuery = searchParams.get("q") || "";
    if (searchQuery.trim() === currentUrlQuery) return;

    setIsLoading(true);

    const newParams = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      newParams.set("q", searchQuery.trim());
    } else {
      newParams.delete("q");
    }

    newParams.delete("p"); // Reset pagination

    const queryString = newParams.toString();
    const url = `${pathname}${queryString ? `?${queryString}` : ""}`;

    router.push(url, { scroll: false });
  }, [searchQuery, pathname, router, searchParams]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery("");

    // Auto-trigger search when clearing so it drops back to default list
    if (searchParams.has("q")) {
      setIsLoading(true);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("q");
      newParams.delete("p");
      const queryString = newParams.toString();
      const url = `${pathname}${queryString ? `?${queryString}` : ""}`;
      router.push(url, { scroll: false });
    }
  };

  return (
    <div className="mt-12 w-full max-w-2xl relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <input
        type="text"
        className="w-full px-12 py-3.5 rounded-sm bg-background border border-foreground/15 text-sm outline-none focus:ring-1 focus:ring-foreground/50 transition-shadow"
        placeholder="Search agents and templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute inset-y-0 right-2 flex items-center gap-1">
        {searchQuery && (
          <button
            onClick={handleClear}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="p-1.5 bg-foreground text-background rounded-sm hover:bg-foreground/80 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
