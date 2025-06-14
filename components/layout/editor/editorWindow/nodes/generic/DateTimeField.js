"use client";

import { Handle, Position } from "reactflow";
import getColorByType from "@/lib/color-profile";
import DateTimePicker from "./DateTimePicker";

export default function DateTimeField({
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
          <div className="relative">
            <Handle
              type="target"
              position={Position.Left}
              id={`input-${field.name}-${matchingInput?.type || "any"}`}
              style={{
                zIndex: 10,
                border: "none",
                left: "-15.3px",
                backgroundColor: "transparent",
              }}
            />

            <div
              className="w-2 h-2 -left-[16.5px] -top-[4.2px] rounded-full rotate-45 absolute border-opacity-50"
              style={{
                backgroundColor: getColorByType(
                  matchingInput?.type.toLowerCase()
                ),
                borderColor: "black",
                borderWidth: "1px",
              }}
            ></div>
          </div>
        )}
        <div className="w-full">
          <DateTimePicker
            value={currentValue}
            onChange={(value) => handleChange(field.name, value)}
            isDisabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
}
