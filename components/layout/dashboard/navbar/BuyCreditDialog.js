"use client";

import { HandCoins } from "lucide-react";
import { useState, useMemo } from "react";

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
import { getPackByKey } from "@/config/dodoBillingConfig";
import { resolveDeforgeId } from "@/lib/billing/identity";
import {
  createOneTimeCheckout,
  redirectToCheckout,
} from "@/lib/billing/checkout";

const CREDIT_PLANS = [
  { label: "500 Credits", value: "500", price: 3, displayPrice: "$3" },
  { label: "1000 Credits", value: "1000", price: 5, displayPrice: "$5" },
  { label: "2000 Credits", value: "2000", price: 8, displayPrice: "$8" },
];

const DEFAULT_PLAN = "500";

const BuyCreditDialog = ({ teamId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(DEFAULT_PLAN);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const currentPlan = useMemo(
    () => CREDIT_PLANS.find((plan) => plan.value === selectedPlan),
    [selectedPlan]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setErrorMsg("");

    try {
      setIsProcessing(true);

      const deforge_id = resolveDeforgeId();
      if (!deforge_id) {
        setErrorMsg(
          "You are not authenticated. Please refresh or sign in again."
        );
        setIsProcessing(false);
        return;
      }

      const cfg = getPackByKey(selectedPlan);
      if (!cfg) {
        setErrorMsg(
          "Selected credit pack is not configured. Please contact support."
        );
        setIsProcessing(false);
        return;
      }

      const { product_id, total_credits, quantity = 1 } = cfg;

      const { checkout_url } = await createOneTimeCheckout({
        product_id,
        total_credits,
        quantity,
        deforge_id,
      });

      // Optionally close dialog just before redirect
      setIsOpen(false);
      setSelectedPlan(DEFAULT_PLAN);

      redirectToCheckout(checkout_url);
    } catch (error) {
      console.error("Failed to initiate checkout:", error);
      setErrorMsg(
        (error && (error.message || error.toString())) ||
          "Failed to start checkout. Please try again."
      );
      setIsProcessing(false);
    }
  };

  const handleOpenChange = (open) => {
    if (isProcessing) return;
    setIsOpen(open);
    if (!open) {
      setSelectedPlan(DEFAULT_PLAN);
      setErrorMsg("");
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
            disabled={isProcessing}
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

          {errorMsg && (
            <div className="text-xs text-destructive mt-2" role="alert">
              {errorMsg}
            </div>
          )}

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  className="text-xs"
                  disabled={isProcessing}
                />
              }
            >
              Cancel
            </DialogClose>

            <Button
              type="submit"
              aria-disabled={isProcessing || !currentPlan}
              disabled={isProcessing || !currentPlan}
              className="text-background rounded-md border-none text-xs"
            >
              {isProcessing
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
