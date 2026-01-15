"use client";

import { Badge } from "@/components/ui/badge";
import TypeBadge from "./common/TypeBadge";
import DisconnectButton from "./common/DisconnectButton";

export default function StandaloneField({
  input,
  isConnected,
  handleDisconnect,
}) {
  return (
    <div key={input.name} className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium text-foreground/80 capitalize flex items-center gap-1">
          {input.name}
          <TypeBadge type={input.type} />
        </div>
        {isConnected && (
          <DisconnectButton handleDisconnect={handleDisconnect} input={input} />
        )}
      </div>
      <Badge
        variant="outline"
        className="text-xs px-2 py-1 bg-foreground/5 w-full flex justify-between items-center border border-foreground/5 text-foreground/70 capitalize"
      >
        <span>{isConnected ? "Connected" : "Not connected"}</span>
        <span className="text-xs">{input.type}</span>
      </Badge>
    </div>
  );
}
