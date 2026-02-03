"use client";

import { useState } from "react";
import { CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPackByKey } from "@/config/dodoBillingConfig";
import { resolveDeforgeIdAsync } from "@/lib/billing/identity";
import {
  createOneTimeCheckout,
  redirectToCheckout,
} from "@/lib/billing/checkout";

// Local render source of packs (labels/prices) stays in the server parent,
// but we need keys to map to Dodo product ids and credits.
// Expect items: [{ id: "500"|"...", name: string, price: string }]
export default function CreditTopupList({ items }) {
  const [loadingKey, setLoadingKey] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleBuy = async (packId) => {
    if (loadingKey) return;
    setErrorMsg("");
    setLoadingKey(packId);

    try {
      const deforge_id = await resolveDeforgeIdAsync();
      if (!deforge_id) {
        setErrorMsg("You are not authenticated. Please refresh or sign in again.");
        setLoadingKey(null);
        return;
      }

      const cfg = getPackByKey(packId);
      if (!cfg) {
        setErrorMsg("Selected credit pack is not configured. Please contact support.");
        setLoadingKey(null);
        return;
      }

      const { product_id, total_credits, quantity = 1 } = cfg;

      const { checkout_url } = await createOneTimeCheckout({
        product_id,
        total_credits,
        quantity,
        deforge_id,
      });

      redirectToCheckout(checkout_url);
    } catch (err) {
      console.error("Checkout initiation failed:", err);
      const msg =
        (err && (err.message || err.toString())) ||
        "Failed to start checkout. Please try again.";
      setErrorMsg(msg);
      setLoadingKey(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <p className="text-xs text-foreground/50 font-medium">Credit Topup</p>

      {items.map((plan) => (
        <div
          className="p-4 border hover:shadow-sm hover:shadow-foreground/5 hover:border-foreground/20 transition-all border-foreground/15 rounded-md flex gap-2 items-center justify-between"
          key={plan.id}
        >
          <p className="text-sm font-medium text-foreground/50 flex items-center gap-2">
            <CircleDot className="size-4" /> {plan.name}
          </p>
          <div className="flex items-center gap-2">
            <div className="p-1 px-2 rounded-sm border border-foreground/20">
              <p className="text-sm font-medium font-mono">{plan.price}</p>
            </div>
            <Button
              className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit"
              onClick={() => handleBuy(plan.id)}
              aria-disabled={loadingKey === plan.id}
              disabled={loadingKey === plan.id}
            >
              {loadingKey === plan.id ? "Processing..." : "Buy"}
            </Button>
          </div>
        </div>
      ))}

      {errorMsg && (
        <div className="text-xs text-destructive mt-1" role="alert">
          {errorMsg}
        </div>
      )}
    </div>
  );
}