"use client";

import { Button } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { Link2Off } from "lucide-react";

export default function CheckBoxField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
  handleDisconnect,
  nodeType,
}) {
  return (
    <div key={field.name} className="space-y-1">
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
            className="h-6 px-2 text-xs bg-black/80 text-background"
            onPress={() => handleDisconnect(field.name)}
          >
            <Link2Off className="h-3 w-3 mr-1" />
            Disconnect
          </Button>
        )}
      </div>
      <Checkbox
        isDisabled={isInput && isConnected}
        isSelected={selectedNode.data[field.name] || false}
        onValueChange={(value) => handleChange(field.name, value)}
        className=""
        classNames={{
          wrapper: "after:bg-black/80 dark:invert",
        }}
      >
        <p className="text-xs font-medium text-black/80 dark:text-background">
          {selectedNode.data[field.name] ? "Yes" : "No"}
        </p>
      </Checkbox>

      <div className="text-[10px] dark:text-background">{field.desc}</div>
    </div>
  );
}
