"use client";

import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { Link2Off } from "lucide-react";

export default function TextField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
  handleDisconnect,
  nodeType,
}) {
  return (
    <div key={field.name} className="space-y-2">
      <div className="flex justify-between items-center dark:text-background dark:border-background">
        <div className="text-sm font-medium capitalize dark:text-background">
          {field.name}
          {isInput && (
            <span className="ml-1 text-xs text-black/50 dark:text-background">
              {nodeType.inputs.find((i) => i.name === field.name)?.type}
            </span>
          )}
        </div>
        {isInput && isConnected && (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs bg-black/80 text-background dark:bg-background dark:text-black"
            onPress={() => handleDisconnect(field.name)}
          >
            <Link2Off className="h-3 w-3" />
            Disconnect
          </Button>
        )}
      </div>
      <Input
        id={field.name}
        value={selectedNode.data[field.name] || ""}
        onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={field.value}
        disabled={isInput && isConnected}
        className="border-black/50 border rounded-lg dark:border-background dark:text-background"
        variant="outline"
      />

      <div className="text-[10px]">{field.desc}</div>
    </div>
  );
}
