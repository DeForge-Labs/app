import { Button } from "@/components/ui/button";
import { Check, CircleDot } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import UpgradeWindow from "./UpgradeWindow";

export default async function PlanBalance({ teamId }) {
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

  const getCredits = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(`${process.env.API_URL}/user/credits`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieHeader,
        },
        credentials: "include",
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const credits = await getCredits();

  if (!credits) {
    redirect("/server-not-found");
  }

  if (!credits?.success) {
    redirect("/");
  }

  return (
    <div>
      <div className="flex flex-col w-full gap-2">
        <p className="text-xs text-foreground/50 font-medium mt-2">
          Current Plan
        </p>

        <div className="p-4 border border-foreground/15 rounded-md">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">
                <span className="capitalize">{credits?.plan} Plan</span>{" "}
                <span className="text-sm ml-1 text-foreground/50 font-light">
                  {plans.find((plan) => plan.id === credits?.plan)?.price}{" "}
                  {plans.find((plan) => plan.id === credits?.plan)?.duration}
                </span>
              </p>
              <div className="flex flex-col gap-1 mt-1">
                {plans
                  .find((plan) => plan.id === credits?.plan)
                  ?.features.map((feature, index) => (
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

            <div className="flex items-center gap-2">
              <Link href="https://deforge.io/pricing" target="_blank">
                <Button
                  variant="outline"
                  className="flex gap-2 font-normal text-xs bg-background border border-foreground/20 rounded-sm w-fit"
                >
                  View Plans
                </Button>
              </Link>
              {credits?.plan !== "enterprise" && (
                <UpgradeWindow currentPlan={credits?.plan} teamId={teamId} />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <p className="text-xs text-foreground/50 font-medium">
            Credit Balance
          </p>
          <div className="p-4 border border-foreground/15 rounded-md flex gap-2 items-center justify-between">
            <p className="text-xs text-foreground/50">Total Credits</p>
            <div className="flex items-end gap-1">
              <p className="text-lg font-medium font-mono">
                {credits?.credits}
              </p>
              <p className="text-xs text-foreground/50 mb-1">Credits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
