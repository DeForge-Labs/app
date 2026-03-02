"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, ChevronLeft, ChevronRight, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPurchases, formatAmount } from "@/lib/billing/purchases";
import { resolveDeforgeIdAsync } from "@/lib/billing/identity";

const LIMIT = 20;

function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();
  const colorMap = {
    succeeded: "text-green-500",
    paid: "text-green-500",
    failed: "text-red-500",
    pending: "text-yellow-500",
    refunded: "text-foreground/50",
  };
  const color = colorMap[normalized] || "text-foreground/50";
  return (
    <span className={`capitalize text-xs font-medium ${color}`}>{status || "—"}</span>
  );
}

export default function PurchaseHistory() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (targetPage) => {
    setIsLoading(true);
    setError("");
    try {
      const deforge_id = await resolveDeforgeIdAsync();
      if (!deforge_id) {
        setError("You are not authenticated. Please refresh or sign in again.");
        setIsLoading(false);
        return;
      }
      const result = await fetchPurchases({ page: targetPage, limit: LIMIT, deforge_id });
      setData(result);
    } catch (err) {
      console.error("Failed to load purchase history:", err);
      setError(err?.message || "Failed to load purchase history.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex flex-col gap-2 mt-2">
      <p className="text-xs text-foreground/50 font-medium">Purchase History</p>

      <div className="border border-foreground/15 rounded-md overflow-hidden">
        <div className="w-full overflow-x-auto">
          {/* Ensure table has a minimum width so columns keep spacing and allow horizontal scroll */}
          <div className="min-w-[800px]">
            {/* Table header */}
            <div className="grid grid-cols-[130px_1fr_100px_90px_120px] gap-3 px-4 py-2 border-b border-foreground/10 bg-foreground/2">
              <p className="text-xs font-medium text-foreground/50">Date</p>
              <p className="text-xs font-medium text-foreground/50">Description</p>
              <p className="text-xs font-medium text-foreground/50 text-right">Amount</p>
              <p className="text-xs font-medium text-foreground/50">Status</p>
              <p className="text-xs font-medium text-foreground/50">Invoice</p>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col gap-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[130px_1fr_100px_90px_120px] gap-3 px-4 py-3 border-b border-foreground/5 last:border-0"
                  >
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!isLoading && error && (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-destructive">{error}</p>
                <Button
                  variant="ghost"
                  className="text-xs mt-2"
                  onClick={() => load(page)}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && data?.items?.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-8">
                <Receipt className="size-6 text-foreground/20" />
                <p className="text-xs text-foreground/40">No purchases yet</p>
              </div>
            )}

            {/* Rows */}
            {!isLoading && !error && data?.items?.length > 0 && (
              <div className="flex flex-col">
                {data.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[130px_1fr_100px_90px_120px] gap-3 px-4 py-3 border-b border-foreground/5 last:border-0 hover:bg-foreground/2 transition-colors items-center"
                  >
                    {/* Date */}
                    <p className="text-xs text-foreground/60 tabular-nums">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "—"}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-foreground/80 truncate">
                      {item.description || "Credit / Subscription payment"}
                    </p>

                    {/* Amount */}
                    <p className="text-xs font-mono font-medium text-right whitespace-nowrap">
                      {formatAmount(item.amount, item.currency)}
                    </p>

                    {/* Status */}
                    <StatusBadge status={item.status} />

                    {/* Invoice */}
                    {item.invoice_url ? (
                      <a
                        href={item.invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download invoice"
                      >
                        <Button
                          variant="outline"
                          className="flex gap-1 text-xs px-2 py-1 h-auto rounded-sm border-foreground/20"
                        >
                          <Download className="size-3" />
                          Download
                        </Button>
                      </a>
                    ) : (
                      <span className="text-xs text-foreground/30">—</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && !error && data && data.total > LIMIT && (
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-foreground/40">
            Page {page} of {totalPages} &middot; {data.total} total
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              className="text-xs h-7 w-7 p-0 border-foreground/20 rounded-sm"
              disabled={!hasPrev || isLoading}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-3" />
            </Button>
            <Button
              variant="outline"
              className="text-xs h-7 w-7 p-0 border-foreground/20 rounded-sm"
              disabled={!hasNext || isLoading}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
