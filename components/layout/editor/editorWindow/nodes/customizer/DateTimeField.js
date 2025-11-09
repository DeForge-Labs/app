"use client";

import DateTimePicker from "../generic/DateTimePicker";
import DisconnectButton from "./common/DisconnectButton";
import TypeBadge from "./common/TypeBadge";

export default function DateTimeField({
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
          {isInput && <TypeBadge type={field.type} />}
        </div>
        {isInput && isConnected && (
          <DisconnectButton handleDisconnect={handleDisconnect} input={field} />
        )}
      </div>
      <DateTimePicker
        isDisabled={isInput && isConnected}
        value={selectedNode.data[field.name]}
        onChange={(value) => handleChange(field.name, value)}
      />

      <div className="text-[10px] text-foreground/60">{field.desc}</div>
    </div>
  );
}
