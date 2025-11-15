"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useFormStore from "@/store/useFormStore";
import { Play } from "lucide-react";
import useWorkflowStore from "@/store/useWorkspaceStore";
import SaveDialog from "../SaveDialog";

export default function FormToolPanel() {
  const { isPreview, setIsPreview } = useFormStore();
  const { hasUnsavedChanges: formHasUnsavedChanges } = useFormStore();
  const { hasUnsavedChanges: workflowHasUnsavedChanges } = useWorkflowStore();
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center z-20">
      <div className="flex items-center bg-background rounded-md">
        <Button className="text-[10px] rounded-md rounded-r-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3">
          <Play />
        </Button>
        <SaveDialog>
          <Button
            variant={"outline"}
            className="text-[10px] w-16 rounded-md rounded-l-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3 bg-card border border-foreground/50 border-l-0"
            disabled={!formHasUnsavedChanges && !workflowHasUnsavedChanges}
          >
            {formHasUnsavedChanges || workflowHasUnsavedChanges
              ? "Save"
              : "Saved"}
            {formHasUnsavedChanges || workflowHasUnsavedChanges ? (
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            ) : null}
          </Button>
        </SaveDialog>
      </div>

      <div className="ml-2 flex items-center bg-background rounded-md">
        <Button
          variant={isPreview ? "outline" : "default"}
          className={cn(
            "text-[10px] w-16 rounded-md rounded-r-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3 border border-foreground/50 border-r-0",
            isPreview && "bg-card"
          )}
          onClick={() => setIsPreview(false)}
        >
          Edit
        </Button>
        <Button
          variant={isPreview ? "default" : "outline"}
          className={cn(
            "text-[10px] w-16 rounded-md rounded-l-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3 border border-foreground/50 border-l-0",
            !isPreview && "bg-card"
          )}
          onClick={() => setIsPreview(true)}
        >
          Preview
        </Button>
      </div>
    </div>
  );
}
