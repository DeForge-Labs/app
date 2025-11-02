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
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackDialog() {
  const [feedback, setFeedback] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="text-xs bg-background font-normal border border-foreground/20 rounded-sm"
            >
              Feedback
            </Button>
          }
        />

        <DialogPopup className="sm:max-w-sm">
          <Form onSubmit={(e) => {}}>
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Send Feedback
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                We would love to hear from you and improve our service. Please
                share your feedback.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              style={{ resize: "none" }}
              rows={5}
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
              >
                Send
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
