"use client";
import { Handle, Position } from "reactflow";
import { Input } from "@heroui/react";
import { useRef, useEffect } from "react";
import getColorByType from "@/lib/color-profile";
import { useSelector } from "react-redux";

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
  const selectedHandle = useSelector((state) => state.workflow?.selectedHandle);

  // Store cursor position before re-render
  const handleInputChange = (e) => {
    cursorPositionRef.current = e.target.selectionStart;
    handleChange(field.name, e.target.value);
  };

  // Restore cursor position after re-render
  useEffect(() => {
    if (inputRef.current && cursorPositionRef.current !== null) {
      const input = inputRef.current;
      // For HeroUI Input, we might need to access the actual input element
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
      <div className="text-xs font-medium capitalize">{field.name}</div>
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
              className={`w-2 h-2 -left-[16.5px] -top-[4.5px] rounded-full rotate-45 absolute border-opacity-50 ${
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
                  className={`w-2 h-2 -left-[16.5px] -top-[4.5px] rounded-full rotate-45 absolute border-opacity-50 `}
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
        <Input
          ref={inputRef}
          value={currentValue || ""}
          variant="outline"
          onChange={handleInputChange}
          placeholder={field.value}
          className="mt-2 border border-black/50 rounded-lg"
          disabled={isDisabled}
          // Add a stable key to prevent unnecessary re-mounting
          key={`${field.name}-input`}
        />
      </div>
    </div>
  );
}
