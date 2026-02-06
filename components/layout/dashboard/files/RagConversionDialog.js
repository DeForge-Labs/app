"use client";

import {
  Clock,
  Loader2,
  XCircle,
  Database,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const RagConversionDialog = ({
  fileKey,
  fileName,
  ragStatus: initialRagStatus,
  ragTableName: initialRagTableName,
  open,
  onOpenChange,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [converting, setConverting] = useState(false);

  const [ragTableName, setRagTableName] = useState(initialRagTableName);
  const [ragStatus, setRagStatus] = useState(
    initialRagStatus || "not-requested",
  );

  const statusInfo = useMemo(
    () =>
      ({
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
      })[ragStatus] || {
        icon: Database,
        color: "text-gray-500",
        bg: "bg-gray-100 dark:bg-gray-800",
        label: "Not Converted",
        description: "This file has not been converted to RAG database yet.",
      },
    [ragStatus],
  );

  const StatusIcon = statusInfo.icon;

  useEffect(() => {
    if (open) {
      setRagStatus(initialRagStatus || "not-requested");
      setRagTableName(initialRagTableName);
      refreshStatus();
    } else {
      setLoading(true);
    }
  }, [open, initialRagStatus, initialRagTableName]);

  const fetchJson = async (input, init = {}) => {
    const res = await fetch(input, init);

    let data;

    try {
      data = await res.json();
    } catch (err) {
      data = null;
    }

    return { ok: res.ok, status: res.status, data };
  };

  const refreshStatus = async () => {
    if (!fileKey) return;

    setChecking(true);

    try {
      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/storage/rag-status/${encodeURIComponent(fileKey)}?t=${Date.now()}`;

      const { ok, data } = await fetchJson(url, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        headers: {
          Pragma: "no-cache",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Content-Type": "application/json",
        },
      });

      if (ok && data && (data.success || data.status)) {
        const { status, tableName, message } = data;

        setRagStatus(status);
        if (tableName) setRagTableName(tableName);

        if (status === "failed" && message) {
          // Optional: Display the error message from the backend in a toast
          toast.error(message);
        }

        if (status === "done" || status === "failed") {
          router.refresh();
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Status check error:", error);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const handleConvert = async () => {
    setConverting(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/storage/convert-to-rag`;

      const { ok, data } = await fetchJson(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileKey }),
      });

      if (ok && data?.success) {
        const { status } = data;
        setRagStatus(status);

        toast.success(
          ragStatus === "failed"
            ? "Retry submitted! Check status shortly."
            : "Conversion started! Click 'Refresh Status' to check progress.",
        );

        router.refresh();
      } else {
        toast.error(data?.message || "Conversion request failed");
      }
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("An error occurred while starting conversion");
    } finally {
      setConverting(false);
    }
  };

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

        {loading ? (
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
                    title={fileName}
                    className="font-medium truncate max-w-[200px]"
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

              {ragStatus === "not-requested" && (
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

              {/* Initial Convert Button */}
              {ragStatus === "not-requested" && (
                <Button
                  onClick={handleConvert}
                  disabled={converting}
                  className="bg-foreground/90 text-background text-xs"
                >
                  {converting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Starting...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" /> Convert (30 credits)
                    </>
                  )}
                </Button>
              )}

              {/* Refresh Button - Shows for Queued, Processing, OR Failed */}
              {(ragStatus === "queued" || ragStatus === "processing") && (
                <Button
                  variant="outline"
                  className="text-xs"
                  disabled={checking || converting}
                  onClick={refreshStatus}
                >
                  {checking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Checking...
                    </>
                  ) : (
                    "Refresh Status"
                  )}
                </Button>
              )}

              {/* Retry Button - Only shows when Failed */}
              {ragStatus === "failed" && (
                <Button
                  disabled={converting || checking}
                  onClick={handleConvert}
                  className="bg-foreground/90 text-background text-xs"
                >
                  {converting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Retrying...
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
};

export default RagConversionDialog;
