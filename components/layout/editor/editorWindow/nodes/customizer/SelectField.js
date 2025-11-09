"use client";

import {
  Select,
  SelectPopup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TypeBadge from "./common/TypeBadge";
import DisconnectButton from "./common/DisconnectButton";

export default function SelectField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
  handleDisconnect,
}) {
  const items = field.options.map((option) => ({
    value: option,
    label: option,
  }));

  const selectedItem = items.find(
    (item) => item.value === (selectedNode.data[field.name] || field.value)
  );

  return (
    <div key={field.name} className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium text-foreground/80 capitalize flex items-center gap-1">
          {field.name}
          {isInput && <TypeBadge type={field.type} />}
        </div>
        {isInput && isConnected && (
          <DisconnectButton handleDisconnect={handleDisconnect} input={field} />
        )}
      </div>

      <Select
        items={items}
        value={selectedItem}
        onValueChange={(item) => handleChange(field.name, item.value)}
        disabled={isInput && isConnected}
      >
        <SelectTrigger className="rounded-sm before:rounded-sm border border-foreground/60">
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

      <div className="text-[10px] text-foreground/60">{field.desc}</div>
    </div>
  );
}
