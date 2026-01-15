"use client";

import { Undo2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import useInitialize from "@/hooks/useInitialize";
import useWorkflowStore from "@/store/useWorkspaceStore";
import useFormStore from "@/store/useFormStore";
import { toast } from "sonner";

export default function UndoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loadWorkflowById, loadFormById } = useInitialize();
  const {
    hasUnsavedChanges: hasUnsavedChangesWorkflow,
    workflow,
    form,
  } = useWorkflowStore();
  const { hasUnsavedChanges: hasUnsavedChangesForm } = useFormStore();
  const handleIsOpenChange = (open) => {
    if (isLoading) {
      return;
    }
    setIsOpen(open);
  };

  const handleUndo = async () => {
    try {
      setIsLoading(true);
      if (hasUnsavedChangesWorkflow) {
        await loadWorkflowById(workflow?.id);
      }
      if (hasUnsavedChangesForm) {
        await loadFormById(form?.id);
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to revert changes");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        className="z-20 px-2 flex group items-center ml-1 h-[28px] relative not-dark:hover:bg-yellow-200 rounded-sm cursor-pointer border border-yellow-500 text-yellow-700 not-dark:bg-yellow-50 dark:hover:bg-yellow-900 dark:text-yellow-200"
        onClick={() => setIsOpen(true)}
      >
        <Undo2 className="size-3 mb-[1.5px]" />

        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max scale-0 rounded bg-background border border-foreground/15 px-2 py-1 text-[10px] font-medium text-foreground shadow-sm transition-all group-hover:scale-100 z-[60]">
          Revert New Changes
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
        <DialogPopup className={"sm:max-w-sm"}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleUndo();
            }}
          >
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Revert New Changes
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Are you sure you want to revert the changes? This will undo the
                changes you have made and load the last saved version.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose
                render={<Button variant="ghost" className="text-xs" />}
              >
                Cancel
              </DialogClose>
              <Button
                className="text-background rounded-md border-none text-xs"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Revert"}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
