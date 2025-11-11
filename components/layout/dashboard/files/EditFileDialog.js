"use client";

import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditFileDialog = ({ fileKey, fileName, open, onOpenChange }) => {
  const router = useRouter();

  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState(fileName);

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
        `${process.env.NEXT_PUBLIC_API_URL}/storage/rename`,
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
      <DialogContent showCloseButton={!isRenaming} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium opacity-80">
            Rename File
          </DialogTitle>

          <DialogDescription className="text-xs">
            Enter a new name for your file. The file extension will be
            preserved.
          </DialogDescription>
        </DialogHeader>

        <Input
          id="fileName"
          value={newFileName}
          disabled={isRenaming}
          placeholder={fileName}
          onChange={(e) => setNewFileName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isRenaming) {
              handleRename();
            }
          }}
        />

        <DialogFooter>
          <Button
            variant="ghost"
            className="text-xs"
            disabled={isRenaming}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleRename}
            className="bg-foreground/90 text-background text-xs"
            disabled={isRenaming || !newFileName || newFileName === fileName}
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
};

export default EditFileDialog;
