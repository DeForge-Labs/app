"use client";

import { Handle, Position } from "reactflow";
import { Checkbox } from "@heroui/react";
import getColorByType from "@/lib/color-profile";

export default function CheckBoxField({
  field,
  nodeType,
  isDisabled,
  currentValue,
  handleChange,
  matchingInput,
}) {
  return (
    <div key={field.name} className="mb-2 relative">
      <div className="text-xs font-medium capitalize mb-1">{field.name}</div>
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
        <Checkbox
          isDisabled={isDisabled}
          isSelected={currentValue || false}
          onValueChange={(value) => handleChange(field.name, value)}
          className=""
          classNames={{
            wrapper: "after:bg-black/80",
          }}
        >
          <p className="text-xs font-medium text-black/80">
            {currentValue ? "Yes" : "No"}
          </p>
        </Checkbox>
      </div>
    </div>
  );
}
