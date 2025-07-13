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
      <div className="flex justify-between items-center dark:text-background dark:border-background">
        <div className="text-sm font-medium capitalize dark:text-background">
          {input.name}
          <span className="ml-2 text-xs text-black/50 dark:text-background">
            (Input: {input.type})
          </span>
        </div>
        {isConnected && (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs bg-black/80 text-background dark:bg-background dark:text-black"
            onPress={() => handleDisconnect(input.name)}
          >
            <Link2Off className="h-3 w-3 mr-1" />
            Disconnect
          </Button>
        )}
      </div>
      <div className="h-10 border border-black/50 rounded-md bg-black/5 text-xs flex items-center justify-between px-3 dark:border-background dark:text-background">
        <span>{isConnected ? "Connected" : "Not connected"}</span>
        <span className="text-black/60 dark:text-background">{input.type}</span>
      </div>
    </div>
  );
}
