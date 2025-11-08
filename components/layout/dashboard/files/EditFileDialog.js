"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function EditFileDialog({
  fileKey,
  fileName,
  open,
  onOpenChange,
}) {
  const [newFileName, setNewFileName] = useState(fileName);
  const [isRenaming, setIsRenaming] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setNewFileName(fileName);
    }
  }, [open, fileName]);

  const handleRename = async () => {
    if (!newFileName || newFileName === fileName) {
      toast.error("Please enter a new file name");
      return;
    }

    setIsRenaming(true);

    try {
      const response = await axios.post(
        "/api/storage/rename",
        { fileKey, newFileName },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("File renamed successfully!");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(response.data.message || "Rename failed");
      }
    } catch (error) {
      console.error("Rename error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while renaming"
      );
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isRenaming}>
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
          <DialogDescription>
            Enter a new name for your file. The file extension will be
            preserved.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="fileName">File Name</label>
            <Input
              id="fileName"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter new file name"
              disabled={isRenaming}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isRenaming) {
                  handleRename();
                }
              }}
            />
          </div>

          <p className="text-xs text-foreground/60">
            Current name: <span className="font-medium">{fileName}</span>
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRenaming}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRename}
            disabled={isRenaming || !newFileName || newFileName === fileName}
            className="bg-foreground/90 text-background"
          >
            {isRenaming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Renaming...
              </>
            ) : (
              "Rename"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
