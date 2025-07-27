"use client";

import { Input } from "@heroui/react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setIsPreview, setIsSelector } from "@/redux/slice/formSlice";

export default function TextField({
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
      toast("Field is already present, cannot be modified");
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
      <Input
        id={field.name}
        value={selectedNode.data[field.name] || ""}
        onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={field.value}
        disabled={isInput && isConnected}
        className="border-black/50 border rounded-lg dark:border-background dark:text-background"
        variant="outline"
      />

      <div className="text-[10px]">{field.desc}</div>
    </div>
  );
}
