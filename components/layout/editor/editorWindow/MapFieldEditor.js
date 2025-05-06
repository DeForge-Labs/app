"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Button } from "@heroui/react";

export default function MapFieldEditor({ value, onChange, disabled = false }) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  // Convert value to object if it's a string
  const mapValue = typeof value === "string" ? {} : value || {};

  // Get entries from the map
  const entries = Object.entries(mapValue);

  const handleAddEntry = () => {
    if (!newKey.trim()) return;

    const updatedMap = { ...mapValue, [newKey]: newValue };
    onChange(updatedMap);

    // Reset inputs
    setNewKey("");
    setNewValue("");
  };

  const handleRemoveEntry = (key) => {
    const updatedMap = { ...mapValue };
    delete updatedMap[key];
    onChange(updatedMap);
  };

  const handleUpdateValue = (key, newVal) => {
    const updatedMap = { ...mapValue, [key]: newVal };
    onChange(updatedMap);
  };

  return (
    <div className="space-y-2">
      {/* Existing key-value pairs */}
      {entries.length > 0 && !disabled ? (
        <Card className="border-dashed border-black/50 shadow-none">
          <CardContent className="p-2 space-y-2">
            {entries.map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <Input
                  value={key}
                  disabled
                  className="flex-1 bg-muted text-xs border border-black/50 rounded-lg"
                  variant="outline"
                />
                <Input
                  value={val}
                  onChange={(e) => handleUpdateValue(key, e.target.value)}
                  className="flex-1 text-xs border border-black/50 rounded-lg"
                  variant="outline"
                  disabled={disabled}
                />
                {!disabled && (
                  <Button
                    variant="outline"
                    size="icon"
                    onPress={() => handleRemoveEntry(key)}
                    className="h-full bg-black/80 rounded-full p-2"
                  >
                    <Trash2 className="h-2 w-2 text-background" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        !disabled && (
          <div className="text-xs border border-dashed border-black/50 rounded-md text-center p-2">
            No entries yet. Add a key-value pair below.
          </div>
        )
      )}

      {disabled && (
        <div className="text-xs border border-dashed border-black/50 rounded-md text-center p-2">
          Entries are disabled, node is connected to input.
        </div>
      )}

      {/* Add new key-value pair */}
      {!disabled && (
        <div className="flex items-center gap-2  w-full h-full">
          <Input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key"
            variant="outline"
            className="flex-1 border border-black/50 rounded-lg"
          />
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            variant="outline"
            className="flex-1 border border-black/50 rounded-lg"
          />
          <Button
            variant="outline"
            size="icon"
            onPress={handleAddEntry}
            className="h-full bg-black/80 rounded-full p-1"
            disabled={!newKey.trim()}
          >
            <Plus className="h-3 w-3 text-background" />
          </Button>
        </div>
      )}
    </div>
  );
}
