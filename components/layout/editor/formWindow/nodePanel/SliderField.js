"use client";

import { Slider } from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setIsPreview, setIsSelector } from "@/redux/slice/formSlice";

export default function SliderField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
  handleDisconnect,
  nodeType,
  nodeId,
}) {
  const dispatch = useDispatch();
  const [value, setValue] = useState(selectedNode.data[field.name] || 0);
  const components = useSelector((state) => state.form.components);

  useEffect(() => {
    setValue(selectedNode.data[field.name] || 0);
  }, [selectedNode.data[field.name]]);

  const handleDragStart = (e) => {
    if (isConnected) {
      toast("Field is already connected, cannot be modified");
      return;
    }

    const isComponentPresent =
      components &&
      components.find(
        (component) => component.id === `${nodeId}|${field.name}`
      );
    if (isComponentPresent) {
      toast("Field is already present, can't add again");
      return;
    }
    dispatch(setIsSelector(false));
    dispatch(setIsPreview(false));
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: field.type,
        id: `${nodeId}|${field.name}`,
        name: field.name,
        component: "component",
      })
    );
  };

  return (
    <div
      key={field.name}
      onDragStart={(e) => handleDragStart(e)}
      draggable
      className="space-y-2 p-3 rounded-lg border border-black/50 dark:border-background dark:text-background bg-background dark:bg-zinc-900"
    >
      <div className="flex justify-between items-center dark:text-background dark:border-background">
        <div className="text-sm font-medium capitalize dark:text-background">
          {field.name}
          {isInput && (
            <span className="ml-1 text-xs text-black/50 dark:text-background">
              {nodeType.inputs.find((i) => i.name === field.name)?.type}
            </span>
          )}
        </div>
        {isInput && isConnected && (
          <div className="text-[10px] text-dark dark:text-background border flex items-center gap-1 rounded-lg p-1 border-dark dark:border-background px-2">
            <div className="h-2 w-2 bg-dark dark:bg-background rounded-full">
              {" "}
            </div>
            Connected
          </div>
        )}
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
      <div className="text-[10px]">{field.desc}</div>
    </div>
  );
}
