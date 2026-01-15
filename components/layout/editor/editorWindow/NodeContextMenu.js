"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      className="absolute z-10 w-40 shadow-lg py-0 "
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="flex flex-col p-2 pt-1">
        <div className="flex items-center justify-between p-2 px-0">
          <span className="text-[10px] font-medium">Node Options</span>

          <div
            className="z-20 p-1 hover:bg-foreground/5 rounded-sm cursor-pointer"
            onClick={onClose}
          >
            <X className="size-3" />
          </div>
        </div>
        <Button
          variant="outline"
          className="flex justify-start px-2 py-1.5 text-xs [&_svg:not([class*='size-'])]:size-3 rounded-md"
          onClick={onDuplicate}
        >
          <Copy className="h-4 w-4" />
          Duplicate
        </Button>
        <Button
          variant="outline"
          className="flex justify-start px-2 py-1.5 text-xs mt-1.5 [&_svg:not([class*='size-'])]:size-3 bg-red-100 text-red-500 border-red-500 hover:bg-red-50 rounded-md"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
