"use client";

import { Checkbox } from "@heroui/react";

export default function CheckBoxField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
}) {
  return (
    <div key={field.name} className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium capitalize dark:text-background">
          {field.name}
        </div>
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

      <div className="text-[10px] dark:text-background text-black/50">
        {field.desc}
      </div>
    </div>
  );
}
