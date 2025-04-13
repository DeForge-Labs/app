"use client";

import { Button } from "@heroui/react";
import { FilePlus, Plus } from "lucide-react";

export default function WorkflowEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-black/10 p-4 mb-4">
        <FilePlus className="h-10 w-10 text-black" />
      </div>
      <h3 className="text-lg font-medium">No workflows yet</h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        Create your first AI agent workflow to automate tasks, process data, or
        connect to external APIs.
      </p>
      <Button
        variant="outline"
        size="md"
        className="bg-black/80 rounded-lg text-background text-xs mt-4"
      >
        <Plus size={16} />
        Create New Workflow
      </Button>
    </div>
  );
}
