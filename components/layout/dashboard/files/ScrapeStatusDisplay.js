"use client";

import { toast } from "sonner";
import { useState, useCallback } from "react";
import { RefreshCw, Link as LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const STATUS_COLORS = {
  done: "bg-green-500",
  processing: "bg-yellow-500",
  queued: "bg-yellow-500",
  failed: "bg-red-500",
  default: "bg-gray-400",
};

const ScrapeStatusDisplay = ({ fileKey, scrapeStatus: initialStatus }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState(initialStatus);

  if (!scrapeStatus || scrapeStatus === "not-requested") return null;

  const statusColor = STATUS_COLORS[scrapeStatus] ?? STATUS_COLORS.default;

  const handleRefresh = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!fileKey) return;

      setIsRefreshing(true);

      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/storage/scrape-status/${encodeURIComponent(fileKey)}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await res.json().catch(() => null);

        if (res.ok && data?.success) {
          setScrapeStatus(data.status);
          toast.success("Status refreshed");
        } else {
          toast.error(data?.message || "Failed to refresh status");
        }
      } catch (err) {
        console.error("Refresh error:", err);
        toast.error("Network error while refreshing");
      } finally {
        setIsRefreshing(false);
      }
    },
    [fileKey]
  );

  return (
    <div className="flex items-center gap-1.5">
      <LinkIcon className="w-3 h-3 text-foreground/50" />

      <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />

      <p className="text-[10px] text-foreground/60 capitalize">
        Scrape: {scrapeStatus.replace(/-/g, " ")}
      </p>

      <Button
        size="icon"
        variant="ghost"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="h-2.5 w-2.5 p-0 hover:bg-transparent"
      >
        <RefreshCw
          className={`h-1.5 w-1.5 text-foreground/60 hover:text-foreground/90 transition-colors ${
            isRefreshing ? " animate-spin" : ""
          }`}
        />
      </Button>
    </div>
  );
};

export default ScrapeStatusDisplay;
