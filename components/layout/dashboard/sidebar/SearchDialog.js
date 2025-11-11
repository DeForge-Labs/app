"use client";

import { Search } from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function SearchDialog({
  open,
  setOpen,
  placeholder = "Search...",
  onSelect,
  results = [],
  searchValue,
  setSearchValue,
}) {
  const router = useRouter();

  const filteredResults = useMemo(() => {
    if (!searchValue.trim()) return results;

    return results.filter(
      (result) =>
        result.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        result.description?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, results]);

  const groupedResults = useMemo(() => {
    const groups = {};

    filteredResults.forEach((result) => {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }

      groups[result.category].push(result);
    });

    return groups;
  }, [filteredResults]);

  const handleSelect = (result) => {
    onSelect?.(result);
    router.push(result.redirect);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-0 gap-0 sm:rounded-lg sm:before:rounded-lg overflow-hidden"
        showCloseButton={false}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="size-4 text-muted-foreground shrink-0" />

          <Input
            autoFocus
            value={searchValue}
            placeholder={placeholder}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-0 focus-visible:ring-0 px-0 rounded-sm"
          />
        </div>

        <div className="max-h-72 overflow-y-auto">
          {Object.keys(groupedResults).length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-2 text-[10px] font-semibold text-muted-foreground bg-muted/50">
                  {category}
                </div>

                {items.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-2 text-sm text-foreground/70 [&_svg]:size-4">
                      {result.icon}
                      {result.title}
                    </div>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
