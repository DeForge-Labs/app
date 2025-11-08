"use client";
import { Handle, Position } from "reactflow";
import { useRef, useEffect } from "react";
import getColorByType from "@/lib/color-profile";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { useTheme } from "next-themes";
import { Textarea } from "@/components/ui/textarea";

export default function TextAreaField({
  field,
  nodeType,
  isDisabled,
  currentValue,
  handleChange,
  matchingInput,
  isConnected,
  isSameNode,
}) {
  const textareaRef = useRef(null);
  const cursorPositionRef = useRef(null);
  const { selectedHandle } = useWorkspaceStore();
  const { resolvedTheme } = useTheme();

  // Store cursor position before re-render
  const handleTextareaChange = (e) => {
    cursorPositionRef.current = e.target.selectionStart;
    handleChange(field.name, e.target.value);
  };

  // Restore cursor position after re-render
  useEffect(() => {
    if (textareaRef.current && cursorPositionRef.current !== null) {
      const textarea = textareaRef.current;
      // For HeroUI Textarea, we might need to access the actual textarea element
      const actualTextarea = textarea.querySelector("textarea") || textarea;
      if (actualTextarea && actualTextarea.setSelectionRange) {
        actualTextarea.setSelectionRange(
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
        {nodeType.inputs.some((input) => input.name === field.name) && (
          <div className="relative">
            <Handle
              type="target"
              position={Position.Left}
              id={`input-${field.name}-${matchingInput?.type || "any"}`}
              style={{
                left: "-15.3px",
                top: "-8px",
                zIndex: 10,
                backgroundColor: "transparent",
                border: "none",
              }}
            />

            <div
              className={`w-2 h-2 -left-[16.2px] -top-[12px] rounded-full rotate-45 absolute border-opacity-50 ${
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
                  className={`w-2 h-2 -left-[16.2px] -top-[12px] rounded-full rotate-45 absolute border-opacity-50 `}
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
        <Textarea
          ref={textareaRef}
          value={currentValue || ""}
          onChange={handleTextareaChange}
          placeholder={field.value}
          className="mt-0.5 rounded-sm dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
          disabled={isDisabled}
          variant="outline"
          rows={3}
          key={`${field.name}-textarea`}
          style={{ fontSize: "12px", resize: "none" }}
        />
      </div>
    </div>
  );
}
