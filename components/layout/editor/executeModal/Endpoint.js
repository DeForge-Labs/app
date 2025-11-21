"use client";

import { ArrowUpRight, Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Endpoint({ workflow }) {
  return (
    <div className="space-y-2 p-4 pb-0">
      <p className="text-[10px] text-foreground/50 flex items-center gap-1">
        <Link2 className="size-3" /> Endpoint
      </p>

      <Input
        variant="outline"
        value={`${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${workflow?.id}`}
        readOnly
        className="py-1 rounded-sm border-foreground/15 bg-card dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
        style={{ fontSize: "12px" }}
      />

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="flex-1 text-xs bg-background border gap-1.5 border-foreground/15 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
          onClick={() => {
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${workflow?.id}`
            );

            toast("Endpoint copied to clipboard");
          }}
        >
          <Copy /> Copy
        </Button>
        <Button
          variant="outline"
          className="flex-1 text-xs bg-background border gap-1.5 border-foreground/15 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
          onClick={() => {
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${workflow?.id}`,
              "_blank"
            );
          }}
        >
          <ArrowUpRight /> Open
        </Button>
      </div>
    </div>
  );
}
