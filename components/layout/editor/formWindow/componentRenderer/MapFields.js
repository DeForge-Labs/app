"use client";

import MapFieldEditor from "../../editorWindow/MapFieldEditor";

export default function MapField({
  field,
  isInput,
  isConnected,
  selectedNode,
  handleChange,
}) {
  return (
    <div key={field.name} className="space-y-2">
      <div className="flex justify-between items-center dark:text-background dark:border-background">
        <div className="text-sm font-medium capitalize dark:text-background">
          {field.name}
        </div>
      </div>
      <MapFieldEditor
        value={selectedNode.data[field.name] || {}}
        onChange={(value) => handleChange(field.name, value)}
        disabled={isInput && isConnected}
      />

      <div className="text-[10px] text-black/50 dark:text-background ">
        {field.desc}
      </div>
    </div>
  );
}
