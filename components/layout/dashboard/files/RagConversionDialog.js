"use client";

import {
  Clock,
  Loader2,
  XCircle,
  Database,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
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

const RAG_STATUS_INFO = {
  "not-requested": {
    icon: Database,
    color: "text-gray-500",
    bg: "bg-gray-100 dark:bg-gray-800",
    label: "Not Converted",
    description: "This file has not been converted to RAG database yet.",
  },

  queued: {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/20",
    label: "Queued",
    description: "File is waiting in queue for conversion.",
  },

  processing: {
    icon: Loader2,
    color: "text-yellow-500",
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
    label: "Processing",
    description: "File is currently being converted.",
    animate: true,
  },

  done: {
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/20",
    label: "Completed",
    description: "File has been successfully converted to RAG database.",
  },

  failed: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-100 dark:bg-red-900/20",
    label: "Failed",
    description: "Conversion failed. You can try again.",
  },
};

export default function RagConversionDialog({
  fileKey,
  fileName,
  ragStatus: initialRagStatus,
  ragTableName: initialRagTableName,
  open,
  onOpenChange,
}) {
  const router = useRouter();

  const [ragStatus, setRagStatus] = useState(
    initialRagStatus || "not-requested"
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [ragTableName, setRagTableName] = useState(initialRagTableName);

  // Update local state when props change
  useEffect(() => {
    setRagStatus(initialRagStatus || "not-requested");
    setRagTableName(initialRagTableName);
  }, [initialRagStatus, initialRagTableName]);

  // Check status when dialog opens (this runs first)
  useEffect(() => {
    if (open && fileKey) {
      setIsLoading(true);
      checkStatus().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [open, fileKey]);

  // Start polling when status is queued or processing
  useEffect(() => {
    if (open && (ragStatus === "queued" || ragStatus === "processing")) {
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
  }, [open, ragStatus]);

  // Cleanup polling on unmount
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
        `${process.env.NEXT_PUBLIC_API_URL}/storage/rag-status/${encodedKey}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setRagStatus(response.data.status);

        if (response.data.tableName) {
          setRagTableName(response.data.tableName);
        }

        // Stop polling if status is done or failed
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

  const handleConvert = async () => {
    setIsConverting(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/storage/convert-to-rag`,
        { fileKey },
        { withCredentials: true }
      );

      if (response.data.success) {
        setRagStatus(response.data.status);
        toast.success("Conversion started! This may take a few minutes.");

        // Start polling
        if (
          response.data.status === "queued" ||
          response.data.status === "processing"
        ) {
          const interval = setInterval(() => {
            checkStatus();
          }, 5000);

          setPollingInterval(interval);
        }

        router.refresh();
      } else {
        toast.error(response.data.message || "Conversion request failed");
      }
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while starting conversion"
      );
    } finally {
      setIsConverting(false);
    }
  };

  const statusInfo =
    RAG_STATUS_INFO[ragStatus] || RAG_STATUS_INFO["not-requested"];
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium opacity-80">
            RAG Database Conversion
          </DialogTitle>

          <DialogDescription className="text-xs">
            Convert this file to a vector database for use with AI models. Costs
            30 credits.
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

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-foreground/70">File:</span>

                  <span
                    className="font-medium truncate max-w-[200px]"
                    title={fileName}
                  >
                    {fileName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-foreground/70">Status:</span>
                  <span className="font-medium capitalize">
                    {ragStatus?.replace(/-/g, " ") || "not requested"}
                  </span>
                </div>

                {ragTableName && (
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Table:</span>
                    <span className="font-mono text-xs bg-foreground/5 px-2 py-1 rounded">
                      {ragTableName}
                    </span>
                  </div>
                )}
              </div>

              {(!ragStatus ||
                ragStatus === "not-requested" ||
                !RAG_STATUS_INFO[ragStatus]) && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[10px]">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />

                  <div className="text-blue-900 dark:text-blue-100">
                    <p className="font-medium mb-1">Supported formats:</p>
                    <p className="text-blue-700 dark:text-blue-200">
                      PDF, DOCX, PPTX, XLSX, HTML, XML, JSON, CSV, TXT, MD, RST,
                      IPYNB
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                className="text-xs"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>

              {(!ragStatus ||
                ragStatus === "not-requested" ||
                !RAG_STATUS_INFO[ragStatus]) && (
                <Button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="bg-foreground/90 text-background text-xs"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      Convert (30 credits)
                    </>
                  )}
                </Button>
              )}

              {(ragStatus === "queued" || ragStatus === "processing") && (
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

              {ragStatus === "failed" && (
                <Button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="bg-foreground/90 text-background text-xs"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    "Retry Conversion"
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
