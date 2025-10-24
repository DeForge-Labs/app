"use client";

import * as React from "react";
import {
  Globe,
  LayoutGrid,
  MessageCircle,
  Search,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogPopup } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const DUMMY_RESULTS = [
  {
    id: "1",
    title: "Apps",
    category: "Quick Actions",
    icon: <LayoutGrid />,
  },
  {
    id: "2",
    title: "Workflow 1",
    category: "Recent Apps",
    icon: <MessageCircle />,
  },
  {
    id: "3",
    title: "Workflow 2",
    category: "Recent Apps",
    icon: <MessageCircle />,
  },
  {
    id: "4",
    title: "Templates",
    category: "Quick Actions",
    icon: <Globe />,
  },
  {
    id: "5",
    title: "Team",
    category: "Quick Actions",
    icon: <Users />,
  },
  {
    id: "6",
    title: "Workflow 3",
    category: "Recent Apps",
    icon: <MessageCircle />,
  },
];

export default function SearchDialog({
  placeholder = "Search...",
  results = DUMMY_RESULTS,
  onSelect,
  buttonLabel = "Search",
}) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const filteredResults = React.useMemo(() => {
    if (!searchValue.trim()) return results;

    return results.filter(
      (result) =>
        result.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        result.description?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, results]);

  const groupedResults = React.useMemo(() => {
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
    setOpen(false);
    setSearchValue("");
  };

  return (
    <>
      <Button
        className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Search />
        {buttonLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="p-0 gap-0 sm:rounded-lg sm:before:rounded-lg overflow-hidden"
          showCloseButton={false}
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <Search className="size-4 text-muted-foreground flex-shrink-0" />
            <Input
              placeholder={placeholder}
              className="border-0 focus-visible:ring-0 px-0 rounded-sm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus
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
    </>
  );
}
