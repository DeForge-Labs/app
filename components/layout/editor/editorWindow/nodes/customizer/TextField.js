"use client";

import TypeBadge from "./common/TypeBadge";
import DisconnectButton from "./common/DisconnectButton";
import { Input } from "@/components/ui/input";

export default function TextField({
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
      <Input
        id={field.name}
        value={selectedNode.data[field.name] || ""}
        onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={field.value}
        disabled={isInput && isConnected}
        className="rounded-sm dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
        style={{ fontSize: "12px" }}
      />

      <div className="text-[10px] text-foreground/60">{field.desc}</div>
    </div>
  );
}
