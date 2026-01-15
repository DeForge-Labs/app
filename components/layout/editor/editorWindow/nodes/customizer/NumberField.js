"use client";

import TypeBadge from "./common/TypeBadge";
import DisconnectButton from "./common/DisconnectButton";
import {
  NumberField as NumField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";

export default function NumberField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
  handleDisconnect,
}) {
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

      <NumField
        defaultValue={0}
        className="mt-1"
        disabled={isInput && isConnected}
        placeholder={field.value?.toString()}
        onChange={(e) => handleChange(field.name, Number(e.target.value))}
        value={selectedNode.data[field.name] || field.value}
      >
        <NumberFieldGroup className="rounded-sm dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none">
          <NumberFieldDecrement
            onClick={() =>
              handleChange(
                field.name,
                Number(selectedNode.data[field.name] || field.value) - 1
              )
            }
            className="rounded-l-sm scale-95"
          />
          <NumberFieldInput />
          <NumberFieldIncrement
            onClick={() =>
              handleChange(
                field.name,
                Number(selectedNode.data[field.name] || field.value) + 1
              )
            }
            className="rounded-r-sm scale-95"
          />
        </NumberFieldGroup>
      </NumField>

      <div className="text-[10px] text-foreground/60">{field.desc}</div>
    </div>
  );
}
