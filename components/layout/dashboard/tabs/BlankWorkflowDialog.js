"use client";

import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { StickyNote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useWorkflow from "@/hooks/useCreateWorkflow";

export default function BlankWorkflowDialog() {
  const { isOpen, setIsOpen, isCreatingWorkflow, handleCreateWorkflow } =
    useWorkflow();
  const [name, setName] = useState("");
  const handleIsOpenChange = (open) => {
    if (isCreatingWorkflow) {
      return;
    }
    setIsOpen(open);
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
      <DialogTrigger
        render={
          <Button
            className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 [&_svg:not([class*='size-'])]:size-3 border border-foreground/20 !px-3 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start text-foreground/60"
            variant="outline"
          >
            <StickyNote />
            Blank workflow
          </Button>
        }
      ></DialogTrigger>
      <DialogPopup className={"sm:max-w-sm"}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateWorkflow(name);
          }}
        >
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Create Blank Workflow
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Start with a clear slate and build your workflow from scratch.
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder={"New Workflow"}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            disabled={isCreatingWorkflow}
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
              type="submit"
              disabled={isCreatingWorkflow || !name}
              onClick={() => {
                handleCreateWorkflow(name);
              }}
            >
              {isCreatingWorkflow ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
