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
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTab } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { getPlanByKey } from "@/config/dodoBillingConfig";
import {
  createSubscriptionCheckout,
  redirectToCheckout,
} from "@/lib/billing/checkout";
import { resolveDeforgeIdAsync } from "@/lib/billing/identity";

export default function UpgradeWindow({ currentPlan, teamId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      duration: "/month",
      features: [
        "500 Credits One Time",
        "3 Apps",
        "Forum Support",
        "Access to all features",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      duration: "/month",
      features: [
        "10000 Credits",
        "Unlimited Apps",
        "Priority Support",
        "Access to all features",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      duration: "pricing",
      features: [
        "Unlimited Credits",
        "Unlimited Apps",
        "Priority Support",
        "Access to all features",
      ],
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setErrorMsg("");

    // Only paid plan ("pro") is supported via hosted checkout
    if (selectedPlan !== "pro") {
      setErrorMsg(
        selectedPlan === "enterprise"
          ? "Please contact sales for Enterprise."
          : "Select a paid plan to continue."
      );
      return;
    }

    try {
      setIsProcessing(true);

      const deforge_id = await resolveDeforgeIdAsync();
      if (!deforge_id) {
        setErrorMsg(
          "You are not authenticated. Please refresh or sign in again."
        );
        setIsProcessing(false);
        return;
      }

      const cfg = getPlanByKey("pro");
      if (!cfg?.plan_id) {
        setErrorMsg(
          "Subscription plan is not configured. Please contact support."
        );
        setIsProcessing(false);
        return;
      }

      const { checkout_url } = await createSubscriptionCheckout({
        plan_id: cfg.plan_id,
        deforge_id,
      });

      redirectToCheckout(checkout_url);
    } catch (err) {
      console.error("Subscription checkout initiation failed:", err);
      const msg =
        (err && (err.message || err.toString())) ||
        "Failed to start subscription checkout. Please try again.";
      setErrorMsg(msg);
      setIsProcessing(false);
    }
  };

  const canSubmit =
    selectedPlan === "pro" &&
    currentPlan !== "enterprise" &&
    currentPlan !== selectedPlan &&
    !isProcessing;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit">
              Upgrade
            </Button>
          }
        />

        <DialogPopup className="sm:max-w-sm">
          <Form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Upgrade Plan
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Choose a plan to upgrade your account.
              </DialogDescription>
            </DialogHeader>

            <Tabs value={selectedPlan} onValueChange={setSelectedPlan}>
              <TabsList
                className={
                  "bg-background [&>span]:bg-foreground/5 [&>span]:rounded-sm w-full"
                }
              >
                <TabsTab value="free" className="text-xs">
                  Free
                </TabsTab>
                <TabsTab value="pro" className="text-xs">
                  Pro
                </TabsTab>
                <TabsTab value="enterprise" className="text-xs">
                  Enterprise
                </TabsTab>
              </TabsList>

              <TabsContent value="free">
                <div className="flex flex-col gap-2 p-4 border border-foreground/15 rounded-md bg-foreground/2">
                  <p className="text-sm font-medium">
                    <span className="capitalize">{plans[0].name} Plan</span>{" "}
                    <span className="text-sm ml-1 text-foreground/50 font-light">
                      {plans[0].price} {plans[0].duration}
                    </span>
                  </p>
                  <div className="flex flex-col gap-1 mt-1">
                    {plans[0].features.map((feature, index) => (
                      <p
                        className="text-xs text-foreground/50 flex items-center gap-1"
                        key={index}
                      >
                        <Check className="size-3" />
                        {feature}
                      </p>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="pro">
                <div className="flex flex-col gap-2 p-4 border border-foreground/15 rounded-md bg-foreground/2">
                  <p className="text-sm font-medium">
                    <span className="capitalize">{plans[1].name} Plan</span>{" "}
                    <span className="text-sm ml-1 text-foreground/50 font-light">
                      {plans[1].price} {plans[1].duration}
                    </span>
                  </p>
                  <div className="flex flex-col gap-1 mt-1">
                    {plans[1].features.map((feature, index) => (
                      <p
                        className="text-xs text-foreground/50 flex items-center gap-1"
                        key={index}
                      >
                        <Check className="size-3" />
                        {feature}
                      </p>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="enterprise">
                <div className="flex flex-col gap-2 p-4 border border-foreground/15 rounded-md bg-foreground/2">
                  <p className="text-sm font-medium">
                    <span className="capitalize">{plans[2].name} Plan</span>{" "}
                    <span className="text-sm ml-1 text-foreground/50 font-light">
                      {plans[2].price} {plans[2].duration}
                    </span>
                  </p>
                  <div className="flex flex-col gap-1 mt-1">
                    {plans[2].features.map((feature, index) => (
                      <p
                        className="text-xs text-foreground/50 flex items-center gap-1"
                        key={index}
                      >
                        <Check className="size-3" />
                        {feature}
                      </p>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

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
                className="text-background rounded-md border-none text-xs"
                type="submit"
                aria-disabled={!canSubmit}
                disabled={!canSubmit}
              >
                {isProcessing
                  ? "Processing..."
                  : selectedPlan === "enterprise"
                  ? "Contact Us"
                  : "Upgrade"}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
