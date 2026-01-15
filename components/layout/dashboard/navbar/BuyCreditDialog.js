"use client";

import { HandCoins } from "lucide-react";
import { useState, useMemo, useTransition } from "react";

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
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const CREDIT_PLANS = [
  { label: "500 Credits", value: "500", price: 3, displayPrice: "$3" },
  { label: "1000 Credits", value: "1000", price: 5, displayPrice: "$5" },
  { label: "2000 Credits", value: "2000", price: 8, displayPrice: "$8" },
];

const DEFAULT_PLAN = "500";

const BuyCreditDialog = ({ teamId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(DEFAULT_PLAN);

  const [isPending, startTransition] = useTransition();

  const currentPlan = useMemo(
    () => CREDIT_PLANS.find((plan) => plan.value === selectedPlan),
    [selectedPlan]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentPlan) return;

    startTransition(async () => {
      try {
        console.log("Purchasing:", currentPlan);
        setIsOpen(false);
        setSelectedPlan(DEFAULT_PLAN);
      } catch (error) {
        console.error("Failed to purchase credits:", error);
      }
    });
  };

  const handleOpenChange = (open) => {
    if (!isPending) {
      setIsOpen(open);

      if (!open) {
        setSelectedPlan(DEFAULT_PLAN);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="text-info data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none  dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent shadow-none! bg-transparent hover:bg-transparent w-full justify-start border-none"
          />
        }
      >
        <HandCoins size={16} aria-hidden="true" />
        Buy Credits
      </DialogTrigger>

      <DialogPopup className="sm:max-w-sm">
        <Form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-medium opacity-80">
              Buy Credits
            </DialogTitle>

            <DialogDescription className="text-xs">
              Top up your credits to continue using our services.
            </DialogDescription>
          </DialogHeader>

          <Select
            items={CREDIT_PLANS}
            value={selectedPlan}
            disabled={isPending}
            onValueChange={setSelectedPlan}
          >
            <SelectTrigger aria-label="Select credit plan">
              <SelectValue />
            </SelectTrigger>

            <SelectPopup>
              {CREDIT_PLANS.map(({ label, value, displayPrice }) => (
                <SelectItem key={value} value={value}>
                  <span className="flex justify-between items-center w-full">
                    <span>{label}</span>

                    <span className="text-muted-foreground ml-4">
                      {displayPrice}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  className="text-xs"
                  disabled={isPending}
                />
              }
            >
              Cancel
            </DialogClose>

            <Button
              type="submit"
              disabled={isPending || !currentPlan}
              className="text-background rounded-md border-none text-xs"
            >
              {isPending
                ? "Processing..."
                : `Buy for ${currentPlan?.displayPrice || "$0"}`}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};

export default BuyCreditDialog;
