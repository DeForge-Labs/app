"use client";

import { Handle, Position } from "reactflow";
import { Input } from "@heroui/react";
import getColorByType from "@/lib/color-profile";

export default function NumberField({
  field,
  nodeType,
  isDisabled,
  currentValue,
  handleChange,
  matchingInput,
}) {
  return (
    <div key={field.name} className="mb-2 relative">
      <div className="text-xs font-medium mb-1 capitalize">{field.name}</div>
      <div className="flex items-center relative">
        {nodeType.inputs.some((input) => input.name === field.name) && (
          <Handle
            type="target"
            position={Position.Left}
            id={`input-${field.name}-${matchingInput?.type || "any"}`}
            style={{
              left: -17,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: getColorByType(
                matchingInput?.type.toLowerCase()
              ),
              width: "8px",
              height: "8px",
            }}
          />
        )}
        <Input
          type="number"
          variant="outline"
          value={currentValue || 0}
          onChange={(e) =>
            handleChange(field.name, Number.parseFloat(e.target.value))
          }
          placeholder={field.value?.toString()}
          className="mt-2 border border-black/50 rounded-lg"
          disabled={isDisabled}
        />
      </div>
    </div>
  );
}
