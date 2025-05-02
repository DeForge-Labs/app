"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@heroui/react";
import { Copy, Trash2, X } from "lucide-react";

export default function NodeContextMenu({
  x,
  y,
  nodeId,
  onDelete,
  onDuplicate,
  onClose,
}) {
  return (
    <Card
      className="absolute z-10 w-48 shadow-lg bg-background border-black/50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between border-b p-2 px-1">
          <span className="text-xs font-medium">Node Options</span>
          <Button
            variant="outline"
            size="icon"
            className="h-5 w-5 rounded-md border border-black/50"
            onPress={onClose}
          >
            <X className="h-3 w-3 text-black/50" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="flex justify-start px-2 py-1.5 text-sm border border-black/50"
          onPress={onDuplicate}
        >
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </Button>
        <Button
          variant="outline"
          className="flex justify-start px-2 py-1.5 text-sm border border-red-500/80 text-red-500/80 mt-1.5"
          onPress={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
