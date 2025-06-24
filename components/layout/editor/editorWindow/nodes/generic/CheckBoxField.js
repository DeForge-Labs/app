"use client";

import { Handle, Position } from "reactflow";
import { Checkbox } from "@heroui/react";
import getColorByType from "@/lib/color-profile";
import { useSelector } from "react-redux";

export default function CheckBoxField({
  field,
  nodeType,
  isDisabled,
  currentValue,
  handleChange,
  matchingInput,
  isConnected,
  isSameNode,
}) {
  const selectedHandle = useSelector((state) => state.workflow?.selectedHandle);

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
              className={`w-2 h-2 -left-[16.5px] -top-[4.2px] rounded-full rotate-45 absolute border-opacity-50 ${
                selectedHandle?.split("-")[0] === "output" &&
                selectedHandle?.split("-")[2]?.toLowerCase() ===
                  (matchingInput?.type.toLowerCase() || "any") &&
                !isConnected &&
                !isSameNode
                  ? "animate-ping"
                  : ""
              }`}
              style={{
                backgroundColor: getColorByType(
                  matchingInput?.type.toLowerCase()
                ),
                borderColor: "black",
                borderWidth: "1px",
              }}
            ></div>

            {selectedHandle?.split("-")[0] === "output" &&
              selectedHandle?.split("-")[2]?.toLowerCase() ===
                (matchingInput?.type.toLowerCase() || "any") &&
              !isConnected &&
              !isSameNode && (
                <div
                  className={`w-2 h-2 -left-[16.5px] -top-[4.2px] rounded-full rotate-45 absolute border-opacity-50 `}
                  style={{
                    backgroundColor: getColorByType(
                      matchingInput?.type.toLowerCase()
                    ),
                    borderColor: "black",
                    borderWidth: "1px",
                  }}
                ></div>
              )}
          </div>
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
