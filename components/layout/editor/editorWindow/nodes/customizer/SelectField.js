"use client";

import { Button } from "@heroui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link2Off } from "lucide-react";

export default function SelectField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
  handleDisconnect,
  nodeType,
}) {
  return (
    <div key={field.name} className="space-y-2">
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
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs bg-black/80 text-background dark:bg-background dark:text-black"
            onPress={() => handleDisconnect(field.name)}
          >
            <Link2Off className="h-3 w-3 mr-1" />
            Disconnect
          </Button>
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
