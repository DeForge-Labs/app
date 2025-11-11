"use client";

import axios from "axios";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, FileUp, X } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { formatFileSize } from "@/lib/utils";

const UploadFileDialog = ({ open, onOpenChange }) => {
  const router = useRouter();

  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/storage/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          withCredentials: true,

          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      if (response.data.success) {
        toast.success("File uploaded successfully!");

        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during upload"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setIsDragging(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showCloseButton={!isUploading} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium opacity-80">
            Upload File
          </DialogTitle>

          <DialogDescription className="text-xs">
            Choose a file to upload to your storage. Maximum file size depends
            on your plan.
          </DialogDescription>
        </DialogHeader>

        <div>
          {!selectedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer ${
                isDragging
                  ? "border-foreground/60 bg-foreground/5"
                  : "border-foreground/20 hover:border-foreground/40"
              }`}
            >
              <FileUp className="w-9 h-9 mx-auto mb-2 opacity-50" />

              <p className="text-xs text-foreground/70">
                Click to select a file or drag and drop
              </p>

              <p className="text-[10px] text-foreground/50">
                All file types supported
              </p>
            </div>
          ) : (
            <div className="border border-foreground/20 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileUp className="w-8 h-8 opacity-50 shrink-0" />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {selectedFile.name}
                    </p>

                    <p className="text-[10px] text-foreground/60">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>

                {!isUploading && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-foreground/60 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>

                  <div className="w-full bg-foreground/10 rounded-full h-2">
                    <div
                      className="bg-foreground/70 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            className="text-xs"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog;
