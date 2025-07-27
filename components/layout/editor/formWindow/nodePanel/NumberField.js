"use client";

import { Input } from "@heroui/react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setIsPreview, setIsSelector } from "@/redux/slice/formSlice";

export default function NumberField({
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
  const components = useSelector((state) => state.form.components);
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
      className="space-y-2 p-3 rounded-lg border border-black/50 dark:border-background dark:text-background bg-background dark:bg-zinc-900"
      onDragStart={(e) => handleDragStart(e)}
      draggable
    >
      <div className="flex justify-between items-center dark:text-background dark:border-background">
        <div className="text-sm font-medium dark:text-background">
          {field.name}
          {isInput && (
            <span className="ml-2 text-xs text-black/50 dark:text-background">
              {nodeType.inputs.find((i) => i.name === field.name)?.type}
            </span>
          )}
        </div>
        {isInput && isConnected && (
          <div className="text-[10px] text-black/50 dark:text-background border flex items-center gap-1 rounded-lg p-1 border-black/50 dark:border-background px-2">
            <div className="h-2 w-2 bg-black/50 dark:bg-background rounded-full">
              {" "}
            </div>
            Connected
          </div>
        )}
      </div>
      <Input
        id={field.name}
        type="number"
        value={selectedNode.data[field.name] || field.value}
        onChange={(e) =>
          handleChange(field.name, Number.parseFloat(e.target.value))
        }
        placeholder={field.value?.toString()}
        className="mt-2 border border-black/50 rounded-lg dark:border-background dark:text-background"
        variant="outline"
        disabled={isInput && isConnected}
      />

      <div className="text-[10px]">{field.desc}</div>
    </div>
  );
}
