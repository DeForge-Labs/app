"use client";

import { Button } from "@heroui/react";
import { Slider } from "@heroui/react";
import { Link2Off } from "lucide-react";

export default function SliderField({
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
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium capitalize">
          {field.name}
          {isInput && (
            <span className="ml-1 text-xs text-black/50">
              {nodeType.inputs.find((i) => i.name === field.name)?.type}
            </span>
          )}
        </div>
        {isInput && isConnected && (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs bg-black/80 text-background"
            onPress={() => handleDisconnect(field.name)}
          >
            <Link2Off className="h-3 w-3" />
            Disconnect
          </Button>
        )}
      </div>
      <Slider
        value={selectedNode.data[field.name] || 0}
        onChange={(value) => handleChange(field.name, value)}
        defaultValue={field.value}
        maxValue={field.max}
        minValue={field.min}
        step={field.step}
        label={"Value"}
        renderValue={({ children, ...props }) => (
          <output {...props}>
            <input
              aria-label="Temperature value"
              className="px-1 py-0.5 w-10 text-right text-xs bg-black/5 outline-none transition-colors rounded-md border border-transparent hover:border-black focus:border-black"
              type="text"
              value={selectedNode.data[field.name] || 0}
              onChange={(e) => {
                const v = e.target.value;

                handleChange(field.name, v);
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
          filler: "bg-black/80",
          label: "text-xs font-medium capitalize",
          thumb: "bg-black/80",
          track:
            "data-[fill-end=true]:border-e-black/80 data-[fill-start=true]:border-s-black/80 border-s-black/80",
        }}
        isDisabled={isInput && isConnected}
      />
      <div className="text-[10px]">{field.desc}</div>
    </div>
  );
}
