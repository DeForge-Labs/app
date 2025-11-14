"use client";

import TypeBadge from "./common/TypeBadge";
import DisconnectButton from "./common/DisconnectButton";
import { Textarea } from "@/components/ui/textarea";

export default function TextAreaField({
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
              type={nodeType.inputs.find((i) => i.name === field.name)?.type}
            />
          )}
        </div>
        {isInput && isConnected && (
          <DisconnectButton handleDisconnect={handleDisconnect} input={field} />
        )}
      </div>

      <Textarea
        value={selectedNode.data[field.name] || ""}
        onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={field.value}
        className="mt-0.5 rounded-sm dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
        disabled={isInput && isConnected}
        variant="outline"
        rows={3}
        key={`${field.name}-textarea`}
        style={{ fontSize: "12px", resize: "none" }}
      />

      <div className="text-[10px] text-foreground/60">{field.desc}</div>
    </div>
  );
}
