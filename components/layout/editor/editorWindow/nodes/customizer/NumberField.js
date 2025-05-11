"use client";

import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { Link2Off } from "lucide-react";

export default function NumberField({
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
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          {field.name}
          {isInput && (
            <span className="ml-2 text-xs text-muted-foreground">
              {nodeType.inputs.find((i) => i.name === field.name)?.type}
            </span>
          )}
        </div>
        {isInput && isConnected && (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs bg-black/80 text-background"
            onPress={() => handleDisconnect(field.name)}
          >
            <Link2Off className="h-3 w-3 mr-1" />
            Disconnect
          </Button>
        )}
      </div>
      <Input
        id={field.name}
        type="number"
        value={selectedNode.data[field.name] || field.value}
        onChange={(e) =>
          handleChange(field.name, Number.parseFloat(e.target.value))
        }
        placeholder={field.value?.toString()}
        className="mt-2 border border-black/50 rounded-lg"
        variant="outline"
        disabled={isInput && isConnected}
      />

      <div className="text-[10px]">{field.desc}</div>
    </div>
  );
}
