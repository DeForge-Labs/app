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
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { HandCoins } from "lucide-react";

export default function BuyCreditDialog({ teamId }) {
  const items = [
    { label: "500 Credits", value: "500", price: "$3" },
    { label: "1000 Credits", value: "1000", price: "$5" },
    { label: "2000 Credits", value: "2000", price: "$8" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopupPlan, setSelectedTopupPlan] = useState("500");

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="text-info data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none  dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent !shadow-none bg-transparent hover:bg-transparent w-full justify-start border-none"
            >
              <HandCoins size={16} />
              Buy Credits
            </Button>
          }
        />

        <DialogPopup className="sm:max-w-sm">
          <Form onSubmit={(e) => {}}>
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Buy Credits
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Topup your credits
              </DialogDescription>
            </DialogHeader>
            <Select
              items={items}
              onValueChange={(e) => {
                setSelectedTopupPlan(e);
              }}
              value={selectedTopupPlan}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPopup alignItemWithTrigger={false}>
                {items.map(({ label, value }) => (
                  <SelectItem key={label} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
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
                Buy for{" "}
                {items.find((plan) => plan.value === selectedTopupPlan)?.price}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
