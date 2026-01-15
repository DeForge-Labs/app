"use client";

import TypeBadge from "./common/TypeBadge";
import DisconnectButton from "./common/DisconnectButton";
import { Checkbox } from "@/components/ui/checkbox";

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
        <div className="text-xs font-medium text-foreground/80 capitalize flex items-center gap-1">
          {field.name}
          {isInput && (
            <TypeBadge
              type={
                nodeType.inputs.find((i) => i.name === field.name)?.type ||
                "any"
              }
            />
          )}
        </div>
        {isInput && isConnected && (
          <DisconnectButton handleDisconnect={handleDisconnect} input={field} />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          disabled={isInput && isConnected}
          checked={selectedNode.data[field.name] || false}
          onCheckedChange={(value) => handleChange(field.name, value)}
        />
        <p className="text-xs font-medium text-black/80 dark:text-white/80">
          {selectedNode.data[field.name] ? "Yes" : "No"}
        </p>
      </div>

      <div className="text-[10px] text-foreground/60">{field.desc}</div>
    </div>
  );
}
