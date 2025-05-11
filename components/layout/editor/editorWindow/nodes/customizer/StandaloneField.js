"use client";

import { Button } from "@heroui/react";
import { Link2Off } from "lucide-react";

export default function StandaloneField({
  input,
  isConnected,
  handleDisconnect,
}) {
  return (
    <div key={input.name} className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium capitalize">
          {input.name}
          <span className="ml-2 text-xs text-muted-foreground">
            (Input: {input.type})
          </span>
        </div>
        {isConnected && (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs bg-black/80 text-background"
            onPress={() => handleDisconnect(input.name)}
          >
            <Link2Off className="h-3 w-3 mr-1" />
            Disconnect
          </Button>
        )}
      </div>
      <div className="h-10 border rounded-md bg-muted/30 text-xs flex items-center justify-between px-3">
        <span>{isConnected ? "Connected" : "Not connected"}</span>
        <span className="text-muted-foreground">{input.type}</span>
      </div>
    </div>
  );
}
