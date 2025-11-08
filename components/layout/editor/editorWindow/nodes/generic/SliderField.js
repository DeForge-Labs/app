"use client";

import { Handle, Position } from "reactflow";
import { useEffect, useState } from "react";
import getColorByType from "@/lib/color-profile";
import { useTheme } from "next-themes";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Label } from "@/components/ui/label";
import { Slider, SliderValue } from "@/components/ui/slider";

export default function SliderField({
  field,
  nodeType,
  isDisabled,
  currentValue,
  handleChange,
  matchingInput,
  isConnected,
  isSameNode,
}) {
  const { resolvedTheme } = useTheme();
  const { selectedHandle } = useWorkspaceStore();

  return (
    <div key={field.name} className="mb-2 relative nodrag nopan">
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

        <Slider
          value={currentValue || field.value}
          defaultValue={field.value}
          onValueChange={(value) => {
            handleChange(field.name, value);
          }}
          max={field.max}
          min={field.min}
          step={field.step}
          disabled={isDisabled}
        >
          <div className="mb-2 flex items-center justify-between gap-1">
            <Label className="text-[10px] text-foreground/80 font-medium capitalize">
              {field.name}
            </Label>
            <SliderValue className="text-[10px] text-foreground/80" />
          </div>
        </Slider>
      </div>
    </div>
  );
}
