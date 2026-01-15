"use client";

import MapFieldEditor from "../../MapFieldEditor";
import TypeBadge from "./common/TypeBadge";
import DisconnectButton from "./common/DisconnectButton";

export default function MapField({
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
      <MapFieldEditor
        value={selectedNode.data[field.name] || {}}
        onChange={(value) => handleChange(field.name, value)}
        disabled={isInput && isConnected}
      />

      <div className="text-[10px] text-foreground/60">{field.desc}</div>
    </div>
  );
}
