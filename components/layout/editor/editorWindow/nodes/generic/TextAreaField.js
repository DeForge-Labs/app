"use client";
import { Handle, Position } from "reactflow";
import { Textarea } from "@heroui/react";
import { useRef, useEffect } from "react";
import getColorByType from "@/lib/color-profile";

export default function TextAreaField({
  field,
  nodeType,
  isDisabled,
  currentValue,
  handleChange,
  matchingInput,
}) {
  const textareaRef = useRef(null);
  const cursorPositionRef = useRef(null);

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
        <Textarea
          ref={textareaRef}
          value={currentValue || ""}
          onChange={handleTextareaChange}
          placeholder={field.value}
          className="text-xs min-h-[80px] border border-black/50 rounded-lg"
          isDisabled={isDisabled}
          variant="outline"
          // Add a stable key to prevent unnecessary re-mounting
          key={`${field.name}-textarea`}
        />
      </div>
    </div>
  );
}
