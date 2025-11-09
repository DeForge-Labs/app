"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        <Card className="border-dashed border-foreground/50 shadow-none py-0 rounded-sm before:shadow-none">
          <CardContent className="p-2 space-y-2">
            {entries.map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <Input
                  value={key}
                  disabled
                  style={{ fontSize: "12px" }}
                  className="flex-1 rounded-sm dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
                  variant="outline"
                />
                <Input
                  value={val}
                  onChange={(e) => handleUpdateValue(key, e.target.value)}
                  className="flex-1 rounded-sm dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
                  variant="outline"
                  style={{ fontSize: "12px" }}
                  disabled={disabled}
                />
                {!disabled && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveEntry(key)}
                    className="h-[30px]"
                  >
                    <Trash2 className="size-3 text-red-400" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        !disabled && (
          <div className="text-[10px] border border-dashed border-foreground/50 rounded-md text-center p-2 ">
            No entries yet. Add a key-value pair in the input fields below.
          </div>
        )
      )}

      {disabled && (
        <div className="text-[10px] border border-dashed border-border rounded-md text-center p-2 ">
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
            style={{ fontSize: "12px" }}
            className="flex-1 rounded-sm dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
          />
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            variant="outline"
            style={{ fontSize: "12px" }}
            className="flex-1 rounded-sm dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
          />
          <Button
            variant="ghost"
            className="rounded-sm bg-foreground/5 hover:bg-foreground/10 border border-foreground/15 h-[30px]"
            size="icon"
            onClick={handleAddEntry}
            disabled={!newKey.trim()}
          >
            <Plus className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
