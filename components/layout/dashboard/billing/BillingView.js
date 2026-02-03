import { CreditCard, Info } from "lucide-react";
import PlanBalance from "./PlanBalance";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CreditTopupList from "./CreditTopupList";

export default function BillingView({ teamId }) {
  const topupPlans = [
    {
      id: "500",
      name: "500 Credits",
      price: "$3",
    },
    {
      id: "1000",
      name: "1000 Credits",
      price: "$5",
    },
    {
      id: "2000",
      name: "2000 Credits",
      price: "$8",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-4 border-b border-foreground/15">
        <div className="flex gap-2">
          <CreditCard size={14} className="mt-1" />

          <div className="flex flex-col gap-0.5">
            <h1 className="text-sm font-medium">Billing</h1>
            <p className="text-xs text-foreground/50">
              Manage your billing and subscription
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 relative">
        <div className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-4 flex flex-col items-center">
          <div className="flex flex-col gap-4 max-w-3xl w-full">
            <div className="flex flex-col gap-2 p-4 border border-foreground/15 rounded-md bg-foreground/2 mt-3">
              <div className="flex gap-2">
                <Info size={14} className="mt-1" />

                <div className="flex flex-col gap-0.5">
                  <h1 className="text-sm font-medium">Notice</h1>
                  <p className="text-xs text-foreground/50">
                    Make sure to refresh the page after buying credits. Credits
                    may appear after 1-2 minutes.
                  </p>
                </div>
              </div>
            </div>
            <Suspense
              fallback={
                <div className="flex flex-col w-full gap-2">
                  <p className="text-xs text-foreground/50 font-medium mt-2">
                    Current Plan
                  </p>

                  <Skeleton className="h-[138px] w-full" />

                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-xs text-foreground/50 font-medium">
                      Credit Balance
                    </p>
                    <Skeleton className="h-[62px] w-full" />
                  </div>
                </div>
              }
            >
              <PlanBalance teamId={teamId} />
            </Suspense>

            <CreditTopupList items={topupPlans} />
          </div>
        </div>
      </div>
    </div>
  );
}
