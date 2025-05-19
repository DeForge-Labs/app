"use client";

import { Handle, Position } from "reactflow";
import getColorByType from "@/lib/color-profile";

export default function ArrayField({
  field,
  matchingInput,
  totalValidConnections,
  isArrayInput,
}) {
  return (
    <div key={field.name} className="mb-2">
      <div className="text-xs font-medium mb-1 flex justify-between items-center capitalize">
        <span>{field.name}</span>
        <div className="text-xs">
          {totalValidConnections} connection
          {totalValidConnections !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="flex items-center">
        <Handle
          type="target"
          position={Position.Left}
          id={`input-${field.name}-${field.type}`}
          style={{
            left: -4,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: getColorByType(
              isArrayInput
                ? matchingInput?.type.split("[]")[0].toLowerCase()
                : matchingInput?.type.toLowerCase()
            ),
            width: "8px",
            height: "8px",
          }}
        />
        <div className="w-full border border-black/50 rounded-md p-2 bg-black/5 text-xs mt-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">
              Array input - accepts multiple connections
            </span>
          </div>
          {totalValidConnections > 0 && (
            <div className="mt-1 pt-1 border-t border-black/50 text-xs text-muted-foreground">
              {totalValidConnections} connection
              {totalValidConnections !== 1 ? "s" : ""} active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
