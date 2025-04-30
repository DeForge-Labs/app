"use client";

import { FileLineChartIcon, X } from "lucide-react";
import { Button } from "@heroui/react";

export default function WorkflowEmptySearch({ setSearch }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-black/10 p-4 mb-4">
        <FileLineChartIcon className="h-10 w-10 text-black" />
      </div>
      <h3 className="text-lg font-medium">No workflows found</h3>
      <p className="text-muted-foreground mt-2 max-w-md mb-5">
        No workflows match your search criteria.
      </p>

      <Button
        variant="outline"
        size="md"
        className="bg-black/80 rounded-lg text-background text-xs"
        onPress={() => {
          setSearch("");
        }}
      >
        <X size={16} />
        Clear Search
      </Button>
    </div>
  );
}
