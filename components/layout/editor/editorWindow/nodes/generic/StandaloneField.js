"use client";

import { Handle, Position } from "reactflow";
import getColorByType from "@/lib/color-profile";

export default function StandaloneField({
  input,
  categoryColor,
  connectedInputs,
}) {
  return (
    <div key={input.name} className="mb-2 relative">
      <div className="text-xs font-medium mb-1">{input.name}</div>
      <div className="flex items-center">
        <Handle
          type="target"
          position={Position.Left}
          id={`input-${input.name}-${input.type}`}
          className={`h-3 w-3 bg-${categoryColor} -ml-1.5`}
          data-type={input.type}
          style={{
            backgroundColor: getColorByType(input.type.toLowerCase()),
            width: "8px",
            height: "8px",
            left: -11,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <div className="h-8 border rounded-md bg-muted/30 text-xs flex items-center justify-between w-full px-2">
          <span>
            {connectedInputs.has(input.name) ? "Connected" : "Not connected"}
          </span>
          <span className="text-xs text-muted-foreground">{input.type}</span>
        </div>
      </div>
    </div>
  );
}
