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
import { Input } from "@/components/ui/input";
import { Share } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function ShareDialog({ shortId, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            children ? (
              children
            ) : (
              <Button
                variant="outline"
                className="data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent !shadow-none bg-transparent hover:bg-transparent w-full justify-start border-none"
              >
                <Share className="w-4 h-4" /> Share
              </Button>
            )
          }
        />

        <DialogPopup className="sm:max-w-sm">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(`https://d4g.app/${shortId}`);
              toast.success("Copied to clipboard");
              setIsOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Share Template
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Copy the link to share this template with others.
              </DialogDescription>
            </DialogHeader>

            <Input
              variant="outline"
              placeholder="Enter invitation code"
              className="w-full shadow-none border-black/50 font-mono border rounded-lg"
              value={`https://d4g.app/${shortId}`}
              readOnly
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
                onClick={() => {
                  navigator.clipboard.writeText(`https://d4g.app/${shortId}`);
                  toast.success("Copied to clipboard");
                  setIsOpen(false);
                }}
              >
                Copy
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
