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
        <div className="relative">
          <Handle
            type="target"
            position={Position.Left}
            id={`input-${input.name}-${input.type}`}
            data-type={input.type}
            style={{
              zIndex: 10,
              border: "none",
              left: "-15.3px",
              top: "-8px",
              backgroundColor: "transparent",
            }}
          />

          <div
            className="w-2 h-2 -left-[16.5px] -top-[12.2px] rounded-full rotate-45 absolute border-opacity-50"
            style={{
              backgroundColor: getColorByType(input.type.toLowerCase()),
              borderColor: "black",
              borderWidth: "1px",
            }}
          ></div>
        </div>
        <div className="h-8 border border-black/50 rounded-md bg-black/5 text-xs flex items-center justify-between w-full px-2">
          <span>
            {connectedInputs.has(input.name) ? "Connected" : "Not connected"}
          </span>
          <span className="text-xs text-black/60">{input.type}</span>
        </div>
      </div>
    </div>
  );
}
