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
import { Input } from "@/components/ui/input";
import useDuplicateWorkflow from "@/hooks/useDuplicateWorkflow";

export default function DuplicateDialog({ appId, appName, setIsOpen, isOpen }) {
  const {
    isDuplicatingWorkflow,
    handleDuplicateWorkflow,
    workflowName,
    setWorkflowName,
  } = useDuplicateWorkflow(setIsOpen);

  const handleIsOpenChange = (open) => {
    if (!isDuplicatingWorkflow) {
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
                Duplicate App
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Do you want to duplicate this app? This will create a copy of
                all the nodes and connections.
              </DialogDescription>
            </DialogHeader>

            <Input
              placeholder={appName + " (Copy)"}
              value={workflowName}
              onChange={(e) => {
                setWorkflowName(e.target.value);
              }}
              disabled={isDuplicatingWorkflow}
              autoFocus
            />

            <DialogFooter>
              <DialogClose
                render={<Button variant="ghost" className="text-xs" />}
              >
                Cancel
              </DialogClose>
              <Button
                className="text-background rounded-md border-none text-xs"
                disabled={isDuplicatingWorkflow}
                type="submit"
                onClick={() => {
                  handleDuplicateWorkflow(appId, appName);
                }}
              >
                {isDuplicatingWorkflow ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Duplicate"
                )}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
