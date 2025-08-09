"use client";

import LogoAnimation from "@/components/ui/LogoAnimation";
import PayPalCreditModal from "@/components/ui/PayPalCreditModal";
import PayPalSubscriptionModal from "@/components/ui/PayPalSubscriptionModal";
import { Button } from "@heroui/react";
import { Check, RefreshCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useTeamCredits from "@/hooks/useTeamCredits";
import useTeamPlan from "@/hooks/useTeamPlan";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Perfect for beginners and hobbyists",
    features: ["Up to 3 AI agents", "500 credits", "Forum support"],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month*",
    description: "For professionals and small teams",
    features: [
      "Up to 20 AI agents",
      "10,000 credits",
      "Priority support",
      "Execution Dashboard",
      "Custom branding",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Contact Us",
    description: "For organizations with advanced needs",
    features: [
      "Unlimited AI agents",
      "Unlimited credits",
      "Priority support",
      "Execution Dashboard",
      "Custom branding",
      "API access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Usage() {
  const scrollContainerRef = useRef(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const isWorkflowInitializing = useSelector(
    (state) => state.team.isWorkflowInitializing
  );
  const team = useSelector((state) => state.team.team);
  const user = useSelector((state) => state.user.user);
  const { credits, isLoading, fetchTeamCredits, refreshCredits } =
    useTeamCredits();
  const {
    fetchTeamPlan,
    getPlanCredits,
    getPlanPrice,
    getPlanName,
    getRenewalDate,
    isLoading: isPlanLoading,
    planData,
  } = useTeamPlan();

  // Fetch credits and plan when team is available
  useEffect(() => {
    if (team?.id) {
      fetchTeamCredits(team.id);
      fetchTeamPlan(team.id);
    }
  }, [team?.id, fetchTeamCredits, fetchTeamPlan]);

  // Update currentPlan state when planData changes
  useEffect(() => {
    if (planData?.plan) {
      setCurrentPlan(planData.plan.toLowerCase());
    }
  }, [planData]);

  const handleRefreshCredits = async () => {
    if (team?.id) {
      await refreshCredits(team.id);
    }
  };

  const handleCreditPurchaseSuccess = () => {
    // Refresh credits after successful purchase
    handleRefreshCredits();
  };

  const handleSubscriptionSuccess = () => {
    // Refresh plan data after successful subscription
    if (team?.id) {
      fetchTeamPlan(team.id);
    }
  };

  const handleDowngrade = async () => {
    try {
      // Call your backend API for downgrade
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/downgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userEmail: user?.email,
          currentPlan: currentPlan
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("Downgrade request submitted successfully!");
        // Refresh plan data
        if (team?.id) {
          fetchTeamPlan(team.id);
        }
      } else {
        throw new Error(result.message || "Downgrade request failed");
      }
    } catch (error) {
      console.error("Downgrade error:", error);
      toast.error("Downgrade request failed. Please contact support.");
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: section.offsetTop,
        behavior: "smooth"
      });
    }
  }

  if (isWorkflowInitializing) return <LogoAnimation />;

  return (
    <div ref={scrollContainerRef} className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col bg-black/5 border border-black/50 dark:border-white/50 dark:bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold dark:text-background">
              Plan Summary
            </h3>
            <div className="bg-primary text-white px-2 py-1 rounded-lg text-xs">
              {isPlanLoading ? "Loading..." : `${getPlanName()} Plan`}
            </div>
          </div>

          <div className="flex items-start gap-6 mt-4 dark:text-background">
            <div className="flex flex-col gap-2">
              <h3 className="text-xs">Credits</h3>
              <p className="text-2xl font-bold text-dark dark:text-background">
                {isPlanLoading ? "..." : getPlanCredits()}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xs">Price / Month</h3>
              <p className="text-2xl font-bold text-dark dark:text-background">
                {isPlanLoading ? "..." : getPlanPrice()}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xs">Renewal</h3>
              <p className="text-2xl font-bold text-dark dark:text-background">
                {isPlanLoading ? "..." : getRenewalDate()}
              </p>
            </div>
          </div>

          <div className="flex flex-row-reverse items-center gap-2 mt-4 border-t border-black/50 dark:border-white/50 pt-4">
            <Button
              variant="outline"
              size="md"
              className="bg-black/80 rounded-lg text-background text-xs h-9 dark:bg-background dark:text-black"
              onPress={() => {
                scrollToSection("plans");
              }}
            >
              Change Plan
            </Button>
          </div>
        </div>

        <div className="flex flex-col bg-black/5 border border-black/50 dark:border-white/50 dark:bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold dark:text-background">
              Credit Balance
            </h3>
          </div>

          <div className="flex items-start gap-6 mt-4 dark:text-background">
            <div className="flex flex-col gap-2">
              <h3 className="text-xs">Credits</h3>
              <div className="flex flex-row gap-4">
                <p className="text-2xl font-bold text-dark dark:text-background">
                  {isLoading ? "..." : credits !== null ? credits : "N/A"}
                </p>
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  onPress={handleRefreshCredits}
                  isLoading={isLoading}
                  isDisabled={!team?.id}
                  className="border border-black/50 dark:border-white/50"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse items-center gap-2 mt-4 border-t border-black/50 dark:border-white/50 pt-4">
            <Button
              variant="outline"
              size="md"
              className="bg-black/80 rounded-lg text-background text-xs h-9 dark:bg-background dark:text-black"
              onPress={() => setIsCreditModalOpen(true)}
            >
              Buy more credits
            </Button>
          </div>
        </div>

        <div className="flex flex-col bg-black/5 border border-black/50 dark:border-white/50 dark:bg-white/5 rounded-lg p-4">
          <p id="plans" className="text-sm font-bold dark:text-background">Plans</p>
          <p className="text-xs opacity-70 font-normal text-black dark:text-background">
            Compare plans to find the right one for you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-4 dark:text-background">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-lg border border-black/50 dark:border-white/50 flex flex-col justify-between ${
                  currentPlan === plan.id
                    ? "border-primary shadow-lg"
                    : "bg-background shadow-sm dark:bg-white/5 "
                } p-6 md:p-8 relative`}
              >
                {currentPlan === plan.id && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Current
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl md:text-4xl font-extrabold">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="ml-1 text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.id !== "enterprise" && (
                  <Button
                    variant="outline"
                    size="md"
                    className="bg-black/80 rounded-lg text-background text-xs h-12 dark:bg-background dark:text-black mt-6"
                    isDisabled={currentPlan === plan.id}
                    onPress={() => {
                      if (currentPlan === plan.id) return;
                      
                      // Handle upgrade to pro
                      if (currentPlan === "free" && plan.id === "pro") {
                        setIsSubscriptionModalOpen(true);
                      }
                      // Handle downgrade
                      else if ((currentPlan === "pro" && plan.id === "free") || 
                               (currentPlan === "enterprise" && plan.id === "pro")) {
                        handleDowngrade();
                      }
                    }}
                  >
                    {currentPlan !== "free" &&
                      plan.id === "free" &&
                      "Downgrade"}
                    {currentPlan === "free" && plan.id !== "free" && "Upgrade"}
                    {currentPlan === plan.id && "Current"}
                    {currentPlan === "enterprise" &&
                      plan.id === "pro" &&
                      "Downgrade"}
                  </Button>
                )}

                {plan.id === "enterprise" && (
                  <Button
                    variant="outline"
                    size="md"
                    className="bg-black/80 rounded-lg text-background text-xs h-12 dark:bg-background dark:text-black mt-6"
                    isDisabled={currentPlan === plan.id}
                  >
                    {(currentPlan !== "enterprise" && "Contact Us") ||
                      "Current"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PayPal Modals */}
      <PayPalCreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        onSuccess={handleCreditPurchaseSuccess}
      />

      <PayPalSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSuccess={handleSubscriptionSuccess}
        planId="pro"
      />
    </div>
  );
}
