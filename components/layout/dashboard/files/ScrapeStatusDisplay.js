"use client";

import { useCallback } from "react";
import { RefreshCw, Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const STATUS_COLORS = {
  done: "bg-green-500",
  processing: "bg-yellow-500",
  queued: "bg-yellow-500",
  failed: "bg-red-500",
  default: "bg-gray-400",
};

const ScrapeStatusDisplay = ({ scrapeStatus }) => {
  const router = useRouter();

  const statusColor = STATUS_COLORS[scrapeStatus] ?? STATUS_COLORS.default;

  const handleRefresh = useCallback(async (e) => {
    router.refresh();
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <LinkIcon className="w-3 h-3 text-foreground/50" />

      <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />

      <p className="text-[10px] text-foreground/60 capitalize">
        Scrape: {scrapeStatus.replace(/-/g, " ")}
      </p>

      <Button
        size="icon"
        title="Refresh"
        variant="ghost"
        onClick={handleRefresh}
        className="h-2.5 w-2.5 p-0 hover:bg-transparent"
      >
        <RefreshCw
          className={`size-3 text-foreground/60 hover:text-foreground/90 transition-colors`}
        />
      </Button>
    </div>
  );
};

export default ScrapeStatusDisplay;
