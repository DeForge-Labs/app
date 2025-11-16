"use client";

import {
  Clock,
  Loader2,
  XCircle,
  CheckCircle2,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SCRAPE_STATUS_INFO = {
  "not-requested": {
    icon: LinkIcon,
    color: "text-gray-500",
    bg: "bg-gray-100 dark:bg-gray-800",
    label: "Not Scraped",
    description: "This file was not scraped from a URL.",
  },

  queued: {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/20",
    label: "Queued",
    description: "URL is waiting in queue for scraping.",
  },

  processing: {
    icon: Loader2,
    color: "text-yellow-500",
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
    label: "Processing",
    description: "URL is currently being scraped.",
    animate: true,
  },

  done: {
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/20",
    label: "Completed",
    description: "URL has been successfully scraped.",
  },

  failed: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-100 dark:bg-red-900/20",
    label: "Failed",
    description: "Scraping failed. The URL may be inaccessible.",
  },
};

export default function ScrapeStatusDialog({
  fileKey,
  fileName,
  scrapeStatus: initialScrapeStatus,
  sourceUrl: initialSourceUrl,
  open,
  onOpenChange,
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);

  const [sourceUrl, setSourceUrl] = useState(initialSourceUrl);
  const [scrapeStatus, setScrapeStatus] = useState(
    initialScrapeStatus || "not-requested"
  );

  useEffect(() => {
    setScrapeStatus(initialScrapeStatus || "not-requested");
    setSourceUrl(initialSourceUrl);
  }, [initialScrapeStatus, initialSourceUrl]);

  useEffect(() => {
    if (open && fileKey) {
      setIsLoading(true);
      checkStatus().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [open, fileKey]);

  useEffect(() => {
    if (open && (scrapeStatus === "queued" || scrapeStatus === "processing")) {
      const interval = setInterval(() => {
        checkStatus();
      }, 5000);

      setPollingInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [open, scrapeStatus]);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const checkStatus = async () => {
    setIsChecking(true);

    try {
      const encodedKey = encodeURIComponent(fileKey);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/storage/scrape-status/${encodedKey}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setScrapeStatus(response.data.status);

        if (response.data.sourceUrl) {
          setSourceUrl(response.data.sourceUrl);
        }

        if (
          response.data.status === "done" ||
          response.data.status === "failed"
        ) {
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }

          router.refresh();
        }
      }
    } catch (error) {
      console.error("Status check error:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const statusInfo =
    SCRAPE_STATUS_INFO[scrapeStatus] || SCRAPE_STATUS_INFO["not-requested"];
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium opacity-80">
            Scrape Status
          </DialogTitle>

          <DialogDescription className="text-xs">
            View the scraping status and source URL for this file.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-foreground/50" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${statusInfo.bg}`}
              >
                <StatusIcon
                  className={`w-6 h-6 ${statusInfo.color} ${
                    statusInfo.animate ? "animate-spin" : ""
                  }`}
                />

                <div className="flex-1">
                  <p className="font-medium text-xs">{statusInfo.label}</p>
                  <p className="text-[10px] text-foreground/70 mt-0.5">
                    {statusInfo.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-foreground/70 shrink-0">File:</span>

                  <span
                    className="font-medium truncate text-right"
                    title={fileName}
                  >
                    {fileName}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-foreground/70 shrink-0">Status:</span>
                  <span className="font-medium capitalize text-right">
                    {scrapeStatus?.replace(/-/g, " ") || "not requested"}
                  </span>
                </div>

                {sourceUrl && (
                  <div className="flex justify-between gap-3 items-start">
                    <span className="text-foreground/70 shrink-0">Source:</span>

                    <Link
                      target="_blank"
                      href={sourceUrl}
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all text-right flex items-center gap-1"
                    >
                      <span
                        title={sourceUrl}
                        className="truncate max-w-[250px]"
                      >
                        {sourceUrl}
                      </span>

                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                className="text-xs"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>

              {(scrapeStatus === "queued" || scrapeStatus === "processing") && (
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={checkStatus}
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Refresh Status"
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
