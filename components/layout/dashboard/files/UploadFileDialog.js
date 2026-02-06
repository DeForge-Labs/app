"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { Loader2, Upload, FileUp, X, Link } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";

import { formatFileSize } from "@/lib/utils";

const UploadFileDialog = ({ open, onOpenChange }) => {
  const router = useRouter();

  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("file");

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [url, setUrl] = useState("");
  const [deepSearch, setDeepSearch] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  const isProcessing = isUploading || isScraping;

  const resetFile = useCallback(() => {
    setSelectedFile(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const resetUrl = useCallback(() => {
    setUrl("");
    setDeepSearch(false);
  }, []);

  const closeDialog = useCallback(() => {
    if (isProcessing) return;

    resetFile();
    resetUrl();
    setActiveTab("file");

    setIsScraping(false);
    onOpenChange(false);
  }, [isProcessing, resetFile, resetUrl, onOpenChange]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];

    if (file) setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (file) setSelectedFile(file);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return toast.error("Please select a file");

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/storage/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const data = await res.json();

      if (res.ok && data?.success) {
        toast.success("File uploaded!");
        closeDialog();

        router.refresh();
      } else {
        toast.error(data?.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, closeDialog, router]);

  const handleScrape = useCallback(async () => {
    if (!url.trim()) return toast.error("Please enter a URL");

    try {
      new URL(url);
    } catch {
      return toast.error("Invalid URL");
    }

    setIsScraping(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/storage/scrape-url`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim(), deepSearch }),
        },
      );

      const data = await res.json();

      if (res.ok && data?.success) {
        toast.success("Scraping started!");
        closeDialog();

        router.refresh();
      } else {
        toast.error(data?.message || "Scrape failed");
        setIsScraping(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Scrape error");
      setIsScraping(false);
    }
  }, [url, deepSearch, closeDialog, router]);

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={!isProcessing} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium opacity-80">
            Add Content
          </DialogTitle>

          <DialogDescription className="text-xs">
            Upload a file or scrape a URL
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
          <TabsList
            variant="default"
            className="w-full bg-background [&>span]:bg-foreground/5 [&>span]:rounded-md"
          >
            <TabsTab
              value="file"
              disabled={isProcessing}
              className="flex-1 text-xs"
            >
              <FileUp className="h-4 w-4" />
              File Upload
            </TabsTab>

            <TabsTab
              value="url"
              disabled={isProcessing}
              className="flex-1 text-xs"
            >
              <Link className="h-4 w-4" />
              URL Scrape
            </TabsTab>
          </TabsList>

          <TabsPanel value="file" className="mt-4">
            {!selectedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer border-foreground/20 hover:border-foreground/40"
              >
                <FileUp className="w-12 h-12 mx-auto mb-3 opacity-50" />

                <p className="text-sm text-foreground/70">Click or drag file</p>
                <p className="text-xs text-foreground/50">
                  All formats supported
                </p>
              </div>
            ) : (
              <div className="border border-foreground/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileUp className="w-8 h-8 opacity-50 shrink-0" />

                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-[250px]">
                        {selectedFile.name}
                      </p>

                      <p className="text-xs text-foreground/60">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>

                  {!isUploading && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="shrink-0"
                      onClick={resetFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
            />
          </TabsPanel>

          <TabsPanel value="url" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm">
                  Website URL
                </Label>

                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  disabled={isScraping}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deepSearch"
                  checked={deepSearch}
                  disabled={isScraping}
                  onCheckedChange={setDeepSearch}
                />

                <Label htmlFor="deepSearch" className="text-sm cursor-pointer">
                  Deep search (crawl up to 50 pages)
                </Label>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-xs font-medium">Credit Cost:</p>
                <p className="text-xs">Simple scraping: 15 credits</p>
                <p className="text-xs">Deep search: 222 credits</p>
              </div>
            </div>
          </TabsPanel>
        </Tabs>

        <DialogFooter>
          <Button
            variant="ghost"
            className="text-xs"
            onClick={closeDialog}
            disabled={isProcessing}
          >
            Cancel
          </Button>

          {activeTab === "file" ? (
            <Button
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
              className="bg-foreground/90 text-background text-xs"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled={!url.trim() || isScraping}
              onClick={handleScrape}
              className="bg-foreground/90 text-background text-xs"
            >
              {isScraping ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4" />
                  Scrape URL
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog;
