"use client";

import { Slider } from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setIsPreview, setIsSelector } from "@/redux/slice/formSlice";

export default function SliderField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
}) {
  const [value, setValue] = useState(selectedNode.data[field.name] || 0);

  useEffect(() => {
    setValue(selectedNode.data[field.name] || 0);
  }, [selectedNode.data[field.name]]);

  return (
    <div key={field.name} className="space-y-2">
      <div className="flex justify-between items-center dark:text-background dark:border-background">
        <div className="text-sm font-medium capitalize dark:text-background">
          {field.name}
        </div>
      </div>
      <Slider
        value={selectedNode.data[field.name] || 0}
        onChange={(value) => {
          setValue(value);
          handleChange(field.name, value);
        }}
        defaultValue={field.value}
        maxValue={field.max}
        minValue={field.min}
        step={field.step}
        label={"Value"}
        renderValue={({ children, ...props }) => (
          <output {...props}>
            <input
              aria-label="Temperature value"
              className="px-1 py-0.5 w-10 text-right text-xs bg-black/5 outline-none transition-colors rounded-md border border-transparent hover:border-black focus:border-background dark:bg-white/5 dark:hover:border-background dark:focus:border-background dark:text-background dark:bg-dark"
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
                if (
                  e.key === "Enter" &&
                  !isNaN(Number(selectedNode.data[field.name]))
                ) {
                  handleChange(
                    field.name,
                    Number(selectedNode.data[field.name])
                  );
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
        isDisabled={isInput && isConnected}
      />
      <div className="text-[10px] text-black/50 dark:text-background">
        {field.desc}
      </div>
    </div>
  );
}
