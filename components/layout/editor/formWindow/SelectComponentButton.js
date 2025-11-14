"use client";

import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import NodeEditor from "../editorWindow/NodeEditor";
import ComponentPanel from "./ComponentPanel";
import useFormStore from "@/store/useFormStore";

export default function SelectComponentButton({
  component,
  text = "Select Node Component",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const { updateComponent } = useFormStore();

  const handleIsOpenChange = (open) => {
    setIsOpen(open);
  };

  const handleSubmit = () => {
    updateComponent({
      id: component.id,
      content: selectedComponent,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
      <DialogTrigger
        render={
          <Button
            className="py-0 rounded-sm text-[10px] [&_svg:not([class*='size-'])]:size-3"
            onClick={() => {}}
          >
            <Workflow /> {text}
          </Button>
        }
      ></DialogTrigger>
      <DialogPopup
        className="sm:max-w-[100%-200px] h-full sm:max-h-[100%-200px] sm:before:basis-[0vh]"
        beforeBasis="0vh"
      >
        <Form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Select Node Component
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Choose the node component to add to the form.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-1 relative rounded-lg overflow-hidden border border-foreground/20">
            <div className="flex-1 relative flex flex-col z-10 bg-background">
              <NodeEditor />
            </div>

            <div className="h-full p-2 overflow-y-auto hide-scroll absolute right-0">
              <ComponentPanel
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" className="text-xs" />}
            >
              Cancel
            </DialogClose>
            <Button
              className="text-background rounded-md border-none text-xs"
              type="submit"
              onClick={handleSubmit}
              disabled={!selectedComponent}
            >
              Select
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
