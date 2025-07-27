"use client";

import DateTimePicker from "../../editorWindow/nodes/generic/DateTimePicker";

export default function DateTimeField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
}) {
  return (
    <div key={field.name} className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium capitalize dark:text-background">
          {field.name}
        </div>
      </div>
      <DateTimePicker
        isDisabled={isInput && isConnected}
        value={selectedNode.data[field.name]}
        onChange={(value) => handleChange(field.name, value)}
      />

      <div className="text-[10px] dark:text-background text-black/50">
        {field.desc}
      </div>
    </div>
  );
}
