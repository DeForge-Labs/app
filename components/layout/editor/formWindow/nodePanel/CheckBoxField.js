"use client";

import { Checkbox } from "@heroui/react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setIsPreview, setIsSelector } from "@/redux/slice/formSlice";

export default function CheckBoxField({
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
      onDragStart={(e) => handleDragStart(e)}
      draggable
      className="space-y-2 p-3 rounded-lg border border-black/50 dark:border-background dark:text-background bg-background dark:bg-zinc-900"
    >
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium capitalize dark:text-background">
          {field.name}
          {isInput && (
            <span className="ml-2 text-xs text-black/50 dark:text-background">
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
      <Checkbox
        isDisabled={isInput && isConnected}
        isSelected={selectedNode.data[field.name] || false}
        onValueChange={(value) => handleChange(field.name, value)}
        className=""
        classNames={{
          wrapper: "after:bg-black/80 dark:invert",
        }}
      >
        <p className="text-xs font-medium text-black/80 dark:text-background">
          {selectedNode.data[field.name] ? "Yes" : "No"}
        </p>
      </Checkbox>

      <div className="text-[10px] dark:text-background">{field.desc}</div>
    </div>
  );
}
