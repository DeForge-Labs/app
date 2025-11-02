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
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import useUseTemplate from "@/hooks/useUseTemplate";

export default function UseTemplateDialog({ teamId, templateId }) {
  const [isOpen, setIsOpen] = useState(false);

  const { isUsingTemplate, handleUseTemplate } = useUseTemplate(setIsOpen);

  const handleIsOpenChange = (open) => {
    if (!isUsingTemplate) {
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
              className="data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent !shadow-none bg-transparent hover:bg-transparent w-full justify-start border-none"
            >
              <Plus className="w-4 h-4" /> Use Template
            </Button>
          }
        />
        <DialogPopup className="sm:max-w-sm">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleUseTemplate(teamId, templateId);
            }}
          >
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Use Template
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Use this template to create a new app. This will create a copy
                of the template in your current team.
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
                disabled={isUsingTemplate}
                type="submit"
              >
                {isUsingTemplate ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Use Template"
                )}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
