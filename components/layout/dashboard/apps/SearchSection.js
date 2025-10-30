import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchSection() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-foreground/15 gap-2">
      <Search className="w-4 h-4 opacity-50" />

      <Input
        placeholder="Search apps..."
        className="w-full px-0 border-0 shadow-none has-focus-visible:border-ring has-focus-visible:ring-[0px] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none ring-0 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
      />
    </div>
  );
}
