"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectField({
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
      <Select
        value={selectedNode.data[field.name] || field.value}
        onValueChange={(value) => handleChange(field.name, value)}
        disabled={isInput && isConnected}
      >
        <SelectTrigger
          id={field.name}
          className="border-black/50 border rounded-lg dark:border-background dark:text-background"
        >
          <SelectValue placeholder={`Select ${field.name}`} />
        </SelectTrigger>
        <SelectContent className="border-black/50 border rounded-lg bg-background dark:bg-dark">
          {field.options?.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="hover:bg-black/5 rounded-md dark:hover:bg-white/5 dark:text-background"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="text-[10px] text-black/50 dark:text-background">
        {field.desc}
      </div>
    </div>
  );
}
