"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function ComponentHolder({ onClick, isSelected, children }) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4 rounded-md border-foreground/30 relative [&_svg:not([class*='size-'])]:size-2 overflow-hidden cursor-pointer",
        isSelected && "border-foreground"
      )}
    >
      <div className="absolute inset-0 z-10"></div>
      {isSelected && (
        <div className="absolute top-0 left-0 p-1 bg-foreground text-background rounded-br-sm">
          <Check />
        </div>
      )}
      {children}
    </Card>
  );
}
