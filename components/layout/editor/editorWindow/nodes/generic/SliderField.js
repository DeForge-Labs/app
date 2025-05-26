"use client";

import { Handle, Position } from "reactflow";
import { Slider } from "@heroui/react";
import { useEffect, useState } from "react";
import getColorByType from "@/lib/color-profile";

export default function SliderField({
  field,
  nodeType,
  isDisabled,
  currentValue,
  handleChange,
  matchingInput,
}) {
  const [value, setValue] = useState(currentValue);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  return (
    <div key={field.name} className="mb-2 relative">
      <div className="flex items-center relative">
        {/* Handle is positioned within the relative container */}
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
        <Slider
          value={currentValue || 0}
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
                className="px-1 py-0.5 w-10 text-right text-xs bg-black/5 outline-none transition-colors rounded-md border border-transparent hover:border-black focus:border-black"
                type="text"
                value={value || 0}
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
            filler: "bg-black/80",
            label: "text-xs font-medium capitalize",
            thumb: "bg-black/80",
            track:
              "data-[fill-end=true]:border-e-black/80 data-[fill-start=true]:border-s-black/80 border-s-black/80",
          }}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
}
