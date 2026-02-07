"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

const STATUS_COLORS = {
  done: "bg-green-500",
  processing: "bg-yellow-500",
  queued: "bg-yellow-500",
  failed: "bg-red-500",
  default: "bg-gray-400",
};

const RagStatusDisplay = ({ fileKey, initialRagStatus }) => {
  const router = useRouter();

  const getStatusColor = initialRagStatus
    ? STATUS_COLORS[initialRagStatus] || STATUS_COLORS.default
    : STATUS_COLORS.default;

  const handleRefresh = useCallback(async (e) => {
    router.refresh();
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor}`} />

      <p className="text-[10px] text-foreground/60 capitalize">
        RAG: {initialRagStatus || "Not Requested"}
      </p>

      {initialRagStatus !== "done" && (
        <Button
          size="icon"
          variant="ghost"
          title="Refresh"
          onClick={handleRefresh}
          className="h-3 w-3 p-0 hover:bg-transparent"
        >
          <RefreshCw
            className={`size-3 text-foreground/60 hover:text-foreground/90 transition-colors`}
          />
        </Button>
      )}
    </div>
  );
};

export default RagStatusDisplay;
