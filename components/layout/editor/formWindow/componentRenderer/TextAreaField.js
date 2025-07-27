"use client";

import { Textarea } from "@heroui/react";

export default function TextAreaField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
}) {
  return (
    <div key={field.name} className="space-y-2">
      <div className="flex justify-between items-center dark:text-background dark:border-background">
        <div className="text-sm font-medium capitalize dark:text-background">
          {field.name}
        </div>
      </div>
      <Textarea
        id={field.name}
        value={selectedNode.data[field.name] || ""}
        onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={field.value}
        className="border-black/50 border rounded-lg dark:border-background dark:text-background"
        variant="outline"
        disabled={isInput && isConnected}
      />

      <div className="text-[10px] text-black/50 dark:text-background">
        {field.desc}
      </div>
    </div>
  );
}
