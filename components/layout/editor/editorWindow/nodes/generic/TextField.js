"use client";
import { Handle, Position } from "reactflow";
import { useRef, useEffect } from "react";
import getColorByType from "@/lib/color-profile";
import { useTheme } from "next-themes";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Input } from "@/components/ui/input";

export default function TextField({
  field,
  nodeType,
  isDisabled,
  currentValue,
  handleChange,
  matchingInput,
  isConnected,
  isSameNode,
}) {
  const inputRef = useRef(null);
  const cursorPositionRef = useRef(null);
  const { selectedHandle } = useWorkspaceStore();
  const { resolvedTheme } = useTheme();

  const handleInputChange = (e) => {
    cursorPositionRef.current = e.target.selectionStart;
    handleChange(field.name, e.target.value);
  };

  useEffect(() => {
    if (inputRef.current && cursorPositionRef.current !== null) {
      const input = inputRef.current;

      const actualInput = input.querySelector("input") || input;
      if (actualInput && actualInput.setSelectionRange) {
        actualInput.setSelectionRange(
          cursorPositionRef.current,
          cursorPositionRef.current
        );
      }
    }
  }, [currentValue]);

  return (
    <div key={field.name} className="mb-2 relative">
      <div className="text-[10px] text-foreground/80 font-medium capitalize">
        {field.name}
      </div>
      <div className="flex items-center relative">
        {/* Handle is positioned within the relative container */}
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
              className={`w-2 h-2 -left-[16.2px] -top-[4.5px] rounded-full rotate-45 absolute border-opacity-50 ${
                selectedHandle?.split("-")[0] === "output" &&
                selectedHandle?.split("-")[2]?.toLowerCase() ===
                  (matchingInput?.type.toLowerCase() || "Any") &&
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
                  className={`w-2 h-2 -left-[16.2px] -top-[4.5px] rounded-full rotate-45 absolute border-opacity-50  `}
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
        <Input
          ref={inputRef}
          value={currentValue || ""}
          variant="outline"
          onChange={handleInputChange}
          placeholder={field.value}
          className="mt-0.5 rounded-sm dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
          style={{ fontSize: "12px" }}
          disabled={isDisabled}
          key={`${field.name}-input`}
        />
      </div>
    </div>
  );
}
