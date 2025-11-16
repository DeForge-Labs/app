"use client";

import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, Undo2 } from "lucide-react";
import { useState } from "react";
import useRevertTemplate from "@/hooks/useRevertTemplate";

export default function RevertDialog({ templateId }) {
  const [isOpen, setIsOpen] = useState(false);

  const { isRevertingTemplate, handleRevertTemplate } =
    useRevertTemplate(setIsOpen);

  const handleIsOpenChange = (open) => {
    if (!isRevertingTemplate) {
      setIsOpen(open);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="text-destructive data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent shadow-none! bg-transparent hover:bg-transparent w-full justify-start border-none"
            >
              <Undo2 className="w-4 h-4" /> Revert
            </Button>
          }
        />
        <DialogPopup className="sm:max-w-sm">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleRevertTemplate(templateId);
            }}
          >
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Revert Template
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Revert this template back to its original app. This will remove
                all the stats and data associated with this template.
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
                disabled={isRevertingTemplate}
                type="submit"
              >
                {isRevertingTemplate ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Revert Template"
                )}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
