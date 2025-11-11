"use client";

import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

const RagStatusDisplay = ({ fileKey }) => {
  const [ragStatus, setRagStatus] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsRefreshing(true);

    try {
      const encodedKey = encodeURIComponent(fileKey);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/storage/rag-status/${encodedKey}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Status refreshed");
        setRagStatus(response.data.status);
      } else {
        toast.error("Failed to refresh status");
      }
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh status");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "bg-green-500";
      case "processing":
      case "queued":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-1.5 h-1.5 rounded-full ${getStatusColor(ragStatus)}`}
      />

      <p className="text-[10px] text-foreground/60 capitalize">
        RAG: {ragStatus || "Not Requested"}
      </p>

      <Button
        size="icon"
        variant="ghost"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="h-3 w-3 p-0 hover:bg-transparent"
      >
        <RefreshCw
          className={`h-2.5 w-2.5 text-foreground/60 hover:text-foreground/90 transition-colors ${
            isRefreshing ? "animate-spin" : ""
          }`}
        />
      </Button>
    </div>
  );
};

export default RagStatusDisplay;
