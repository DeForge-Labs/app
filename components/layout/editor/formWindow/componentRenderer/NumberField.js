"use client";

import { Input } from "@heroui/react";

export default function NumberField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
}) {
  return (
    <div key={field.name} className="space-y-2">
      <div className="flex justify-between items-center dark:text-background dark:border-background">
        <div className="text-sm font-medium dark:text-background">
          {field.name}
        </div>
      </div>
      <Input
        id={field.name}
        type="number"
        value={selectedNode.data[field.name] || field.value}
        onChange={(e) =>
          handleChange(field.name, Number.parseFloat(e.target.value))
        }
        placeholder={field.value?.toString()}
        className="mt-2 border border-black/50 rounded-lg dark:border-background dark:text-background"
        variant="outline"
        disabled={isInput && isConnected}
      />

      <div className="text-[10px] text-black/50 dark:text-background">
        {field.desc}
      </div>
    </div>
  );
}
