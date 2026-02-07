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
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTab } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { getPlanByKey } from "@/config/dodoBillingConfig";
import {
  createSubscriptionCheckout,
  redirectToCheckout,
} from "@/lib/billing/checkout";
import { resolveDeforgeId } from "@/lib/billing/identity";
import { cancelSubscription } from "@/lib/billing/subscription";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UpgradeWindow({ currentPlan, teamId }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [cancelImmediate, setCancelImmediate] = useState(false); // default: cancel at period end
  const [cancelResult, setCancelResult] = useState(null);

  const CONTACT_EMAIL = "contact@deforge.io";

  useEffect(() => {
    setSelectedPlan(currentPlan);
  }, [currentPlan]);

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

    // Enterprise: always allow contacting sales (no auth required)
    if (currentPlan !== "pro" && selectedPlan === "enterprise") {
      try {
        window.location.href = `mailto:${CONTACT_EMAIL}`;
      } finally {
        setIsOpen(false);
      }
      return;
    }

    const deforge_id = resolveDeforgeId();
    if (!deforge_id) {
      setErrorMsg("You are not authenticated. Please refresh or sign in again.");
      return;
    }

    try {
      setIsProcessing(true);

      // If user is on Pro, this dialog acts as "Cancel Subscription"
      if (currentPlan === "pro") {
        const data = await cancelSubscription({
          // If you can surface/know subscription_id, pass it here:
          // subscription_id,
          deforge_id,
          immediate: !!cancelImmediate,
          cancel_at_period_end: !cancelImmediate,
        });

        // For "cancel later" (period end) → show concise confirmation and close the modal
        if (data?.cancel_mode === "period_end") {
          const when = data?.next_billing_date
            ? new Date(data.next_billing_date).toLocaleString()
            : "the next billing date";
          toast.success(`Subscription scheduled to cancel on ${when}`);
          router.refresh();
          setIsProcessing(false);
          setIsOpen(false);
          return;
        }

        // For immediate cancellation → keep modal open and show note
        setCancelResult(data);
        router.refresh();

        // Optional short polling up to ~30s to reflect webhook-driven updates
        let elapsed = 0;
        const iv = setInterval(() => {
          router.refresh();
          elapsed += 5;
          if (elapsed >= 30) clearInterval(iv);
        }, 5000);

        setIsProcessing(false);
        return;
      }

      // Otherwise this dialog remains an "Upgrade" for non-pro users
      if (selectedPlan !== "pro") {
        setErrorMsg(
          selectedPlan === "enterprise"
            ? "Please contact sales for Enterprise."
            : "Select the Pro plan to continue."
        );
        setIsProcessing(false);
        return;
      }

      const cfg = getPlanByKey("pro");
      if (!cfg?.plan_id) {
        setErrorMsg("Subscription plan is not configured. Please contact support.");
        setIsProcessing(false);
        return;
      }

      const { checkout_url } = await createSubscriptionCheckout({
        plan_id: cfg.plan_id,
        deforge_id,
      });

      redirectToCheckout(checkout_url);
    } catch (err) {
      console.error("Subscription action failed:", err);
      const msg =
        err?.message ||
        (err?.status === 404
          ? "No active subscription found"
          : err?.status === 400
          ? "Missing required information"
          : "Couldn't cancel subscription. Please try again.");
      setErrorMsg(msg);
      setIsProcessing(false);
    }
  };

  // State and labels
  const isPro = currentPlan === "pro";
  const isFree = currentPlan === "free";
  const isContactUs = !isPro && selectedPlan === "enterprise";

  // Labels: Pro → Cancel Subscription, all others (including Free) → Upgrade
  const triggerLabel = isPro ? "Cancel Subscription" : "Upgrade";
  const triggerDisabled = false;

  const dialogTitle = isPro ? "Cancel Subscription" : "Upgrade Plan";
  const dialogDesc = isPro
    ? "Choose how you want to proceed with the cancellation."
    : "Choose a plan to upgrade your account.";

  const submitDisabled =
    isProcessing || (isPro ? false : !isContactUs && selectedPlan !== "pro");
  const submitLabel = isProcessing
    ? "Processing..."
    : isPro
    ? "Confirm Cancellation"
    : selectedPlan === "enterprise"
    ? "Contact Us"
    : "Upgrade";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button
              className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit"
            >
              {triggerLabel}
            </Button>
          }
        />

        <DialogPopup className="sm:max-w-sm">
          <Form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                {dialogTitle}
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                {dialogDesc}
              </DialogDescription>
            </DialogHeader>

            {/* When cancelling (current plan = pro), show confirmation choices */}
            {isPro ? (
              <div className="flex flex-col gap-3 p-3 border border-foreground/10 rounded-md mt-2">
                <p className="text-xs text-foreground/70">
                  Select how you want to cancel your subscription:
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={cancelImmediate ? "outline" : "default"}
                    className="text-xs"
                    onClick={() => setCancelImmediate(false)}
                    aria-pressed={!cancelImmediate}
                  >
                    Cancel at period end (recommended)
                  </Button>
                  <Button
                    type="button"
                    variant={cancelImmediate ? "default" : "outline"}
                    className="text-xs"
                    onClick={() => setCancelImmediate(true)}
                    aria-pressed={cancelImmediate}
                  >
                    Cancel immediately
                  </Button>
                </div>

                {cancelResult?.success && (
                  <div className="text-xs text-foreground/80 mt-1">
                    {cancelResult.cancel_mode === "period_end" ? (
                      <span>
                        Scheduled to cancel on{" "}
                        <span className="font-medium">
                          {cancelResult.next_billing_date
                            ? new Date(cancelResult.next_billing_date).toLocaleString()
                            : "the next billing date"}
                        </span>
                        . Benefits remain until that date. Final state is confirmed by webhooks and may take a moment to reflect everywhere.
                      </span>
                    ) : (
                      <span>
                        Cancellation requested immediately.
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // Upgrade tabs remain for non-pro users
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
            )}

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
                Close
              </DialogClose>
              {isContactUs ? (
                <Button
                  className="text-background rounded-md border-none text-xs"
                  render={<a />}
                  href={`mailto:${CONTACT_EMAIL}`}
                  aria-label={`Email ${CONTACT_EMAIL}`}
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Button>
              ) : (
                <Button
                  className="text-background rounded-md border-none text-xs"
                  type="submit"
                  aria-disabled={submitDisabled}
                  disabled={submitDisabled}
                >
                  {submitLabel}
                </Button>
              )}
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
