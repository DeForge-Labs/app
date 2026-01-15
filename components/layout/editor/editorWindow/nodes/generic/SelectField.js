"use client";
import { Handle, Position } from "reactflow";
import {
  SelectPopup,
  Select,
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
  const items = field.options.map((option) => ({
    value: option,
    label: option,
  }));

  const selectedItem =
    items.find((item) => item.value === (currentValue || field.value)) || null;

  return (
    <div key={field.name} className="mb-2 relative nodrag nopan">
      <div className="text-[10px] text-foreground/80 font-medium capitalize">
        {field.name}
      </div>
      <div className="flex items-center mt-0.5">
        <Select
          items={items}
          value={selectedItem}
          onValueChange={(item) => handleChange(field.name, item.value)}
          disabled={isDisabled}
        >
          <SelectTrigger className="rounded-sm before:rounded-sm">
            <SelectValue className="text-[12px]" />
          </SelectTrigger>
          <SelectPopup alignItemWithTrigger={false}>
            {items.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>
    </div>
  );
}
