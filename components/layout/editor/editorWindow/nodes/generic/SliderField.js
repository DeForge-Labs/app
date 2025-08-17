"use client";

import { Handle, Position } from "reactflow";
import { Slider } from "@heroui/react";
import { useEffect, useState } from "react";
import getColorByType from "@/lib/color-profile";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";

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
  const selectedHandle = useSelector((state) => state.workflow?.selectedHandle);
  const { resolvedTheme } = useTheme();

  const [value, setValue] = useState(currentValue);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  return (
    <div key={field.name} className="mb-2 relative">
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
                  className={`w-2 h-2 -left-[16.5px] -top-[4.2px] rounded-full rotate-45 absolute border-opacity-50 `}
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
          onChange={(value) => {
            setValue(value);
            handleChange(field.name, value);
          }}
          defaultValue={field.value}
          maxValue={field.max}
          minValue={field.min}
          step={field.step}
          label={field.name}
          renderValue={({ children, ...props }) => (
            <output {...props}>
              <input
                aria-label="Temperature value"
                className="px-1 py-0.5 w-10 text-right text-xs bg-black/5 outline-none transition-colors rounded-md border border-transparent hover:border-black focus:border-black dark:bg-white/5 dark:hover:border-background dark:focus:border-background dark:text-background dark:bg-dark"
                type="text"
                value={value || field.value}
                onChange={(e) => {
                  const v = e.target.value;
                  setValue(v);
                  if (!isNaN(Number(v))) {
                    handleChange(field.name, Number(v));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isNaN(Number(currentValue))) {
                    handleChange(field.name, Number(currentValue));
                  }
                }}
              />
            </output>
          )}
          className="mt-1"
          classNames={{
            filler: "bg-black/80 dark:bg-background",
            label: "text-xs font-medium capitalize dark:text-background",
            thumb: "bg-black/80 dark:bg-background",
            track:
              "data-[fill-end=true]:border-e-black/80 data-[fill-start=true]:border-s-black/80 border-s-black/80 dark:border-s-background",
          }}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
}
