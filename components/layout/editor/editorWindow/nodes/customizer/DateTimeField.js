"use client";

import { Button } from "@heroui/react";
import DateTimePicker from "../generic/DateTimePicker";
import { Link2Off } from "lucide-react";

export default function DateTimeField({
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
        <div className="text-sm font-medium capitalize dark:text-background">
          {field.name}
          {isInput && (
            <span className="ml-2 text-xs text-black/50 dark:text-background">
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
            <Link2Off className="h-3 w-3 mr-1" />
            Disconnect
          </Button>
        )}
      </div>
      <DateTimePicker
        isDisabled={isInput && isConnected}
        value={selectedNode.data[field.name]}
        onChange={(value) => handleChange(field.name, value)}
      />

      <div className="text-[10px] dark:text-background">{field.desc}</div>
    </div>
  );
}
