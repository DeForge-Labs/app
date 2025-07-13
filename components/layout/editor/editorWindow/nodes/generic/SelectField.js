"use client";

import { Handle, Position } from "reactflow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import getColorByType from "@/lib/color-profile";

export default function SelectField({
  field,
  nodeType,
  isDisabled,
  currentValue,
  handleChange,
  matchingInput,
}) {
  return (
    <div key={field.name} className="mb-2 relative">
      <div className="text-xs font-medium mb-1 capitalize">{field.name}</div>
      <div className="flex items-center relative">
        <Select
          value={currentValue || field.value}
          onValueChange={(value) => handleChange(field.name, value)}
          disabled={isDisabled}
        >
          <SelectTrigger className="text-xs border border-black/50 rounded-lg dark:border-background dark:text-background">
            <SelectValue placeholder={field.value} />
          </SelectTrigger>
          <SelectContent className="text-xs border border-black/50 rounded-lg bg-background dark:bg-dark dark:border-background">
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
      </div>
    </div>
  );
}
