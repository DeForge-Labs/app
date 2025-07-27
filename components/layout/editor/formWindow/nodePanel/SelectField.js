"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setIsPreview, setIsSelector } from "@/redux/slice/formSlice";
import { useSelector } from "react-redux";

export default function SelectField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
  handleDisconnect,
  nodeType,
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
        (component) => component.id === `${selectedNode.id}|${field.name}`
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
        id: `${selectedNode.id}|${field.name}`,
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
      <Select
        value={selectedNode.data[field.name] || field.value}
        onValueChange={(value) => handleChange(field.name, value)}
        disabled={isInput && isConnected}
      >
        <SelectTrigger
          id={field.name}
          className="border-black/50 border rounded-lg dark:border-background dark:text-background"
        >
          <SelectValue placeholder={`Select ${field.name}`} />
        </SelectTrigger>
        <SelectContent className="border-black/50 border rounded-lg bg-background dark:bg-dark">
          {field.options?.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="hover:bg-black/5 rounded-md dark:hover:bg-white/5 dark:text-background"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="text-[10px]">{field.desc}</div>
    </div>
  );
}
