"use client";

import { Button } from "@/components/ui/button";
import { Link2Off } from "lucide-react";

export default function DisconnectButton({ handleDisconnect, input }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleDisconnect(input.name)}
      className="text-xs [&_svg:not([class*='size-'])]:size-3 p-0 size-6 rounded-sm bg-foreground/5 border border-foreground/15 h-5 w-6"
    >
      <Link2Off />
    </Button>
  );
}
