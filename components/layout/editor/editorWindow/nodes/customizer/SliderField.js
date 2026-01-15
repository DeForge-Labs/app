"use client";

import { Slider, SliderValue } from "@/components/ui/slider";

import DisconnectButton from "./common/DisconnectButton";
import TypeBadge from "./common/TypeBadge";

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
    <div key={field.name} className="">
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium text-foreground/80 capitalize flex items-center gap-1">
          {field.name}
          {isInput && (
            <TypeBadge
              type={
                nodeType.inputs.find((i) => i.name === field.name)?.type ||
                "any"
              }
            />
          )}
        </div>
        {isInput && isConnected && (
          <DisconnectButton handleDisconnect={handleDisconnect} input={field} />
        )}
      </div>
      {/* <Slider
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
      /> */}

      <Slider
        value={selectedNode.data[field.name] || 0}
        defaultValue={field.value}
        onValueChange={(value) => {
          handleChange(field.name, value);
        }}
        max={field.max}
        min={field.min}
        step={field.step}
        disabled={isInput && isConnected}
      >
        <div className="mb-2 flex items-center justify-between gap-1">
          <div></div>
          <SliderValue className="text-[10px] text-foreground/80" />
        </div>
      </Slider>
      <div className="text-[10px] text-foreground/60 mt-2">{field.desc}</div>
    </div>
  );
}
