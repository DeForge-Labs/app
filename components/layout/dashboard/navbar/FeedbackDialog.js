"use client";

import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Feedback submitted:", feedback);

    setIsOpen(false);
    setFeedback("");
  };

  return (
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
        <Form onSubmit={handleSubmit}>
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
            rows={5}
            value={feedback}
            style={{ resize: "none" }}
            aria-label="Feedback message"
            placeholder="Write your feedback here..."
            onChange={(e) => setFeedback(e.target.value)}
          />

          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" className="text-xs" />}
            >
              Cancel
            </DialogClose>

            <Button
              type="submit"
              disabled={!feedback.trim()}
              className="text-background rounded-md border-none text-xs"
            >
              Send
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
