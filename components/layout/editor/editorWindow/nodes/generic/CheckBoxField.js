"use client";

import { Handle, Position } from "reactflow";
import getColorByType from "@/lib/color-profile";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { Checkbox } from "@/components/ui/checkbox";

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
  const { resolvedTheme } = useTheme();

  return (
    <div key={field.name} className="mb-2 relative">
      <div className="text-[10px] text-foreground/80 font-medium capitalize mb-0.5">
        {field.name}
      </div>
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
              className={`w-2 h-2 -left-[16.2px] -top-[4.2px] rounded-full rotate-45 absolute border-opacity-50 ${
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
                borderColor: resolvedTheme === "dark" ? "white" : "black",
                borderWidth: "1px",
              }}
            ></div>

            {selectedHandle?.split("-")[0] === "output" &&
              selectedHandle?.split("-")[2]?.toLowerCase() ===
                (matchingInput?.type.toLowerCase() || "any") &&
              !isConnected &&
              !isSameNode && (
                <div
                  className={`w-2 h-2 -left-[16.2px] -top-[4.2px] rounded-full rotate-45 absolute border-opacity-50 `}
                  style={{
                    backgroundColor: getColorByType(
                      matchingInput?.type.toLowerCase()
                    ),
                    borderColor: resolvedTheme === "dark" ? "white" : "black",
                    borderWidth: "1px",
                  }}
                ></div>
              )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Checkbox
            disabled={isDisabled}
            checked={currentValue}
            onCheckedChange={(value) => handleChange(field.name, value)}
          />
          <p className="text-xs font-medium text-black/80 dark:text-white/80">
            {currentValue ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}
