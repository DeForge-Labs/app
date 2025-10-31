"use client";

import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import useDeleteWorkflow from "@/hooks/useDeleteWorkflow";

export default function DeleteDialog({ appId, setIsOpen, isOpen }) {
  const { isDeletingWorkflow, handleDeleteWorkflow } =
    useDeleteWorkflow(setIsOpen);

  const handleIsOpenChange = (open) => {
    if (!isDeletingWorkflow) {
      setIsOpen(open);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
        <DialogPopup className="sm:max-w-sm">
          <Form>
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Delete App
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Do you want to delete this app? This will delete all the nodes
                and connections.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose
                render={<Button variant="ghost" className="text-xs" />}
              >
                Cancel
              </DialogClose>
              <Button
                className="bg-destructive text-background rounded-md border-none text-xs"
                disabled={isDeletingWorkflow}
                type="submit"
                onClick={() => {
                  handleDeleteWorkflow(appId);
                }}
              >
                {isDeletingWorkflow ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
