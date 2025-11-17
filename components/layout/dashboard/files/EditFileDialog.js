"use client";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

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

  const [newFileName, setNewFileName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    if (open) setNewFileName("");
  }, [open]);

  const handleRename = useCallback(async () => {
    const trimmed = newFileName.trim();

    if (!trimmed) {
      toast.error("Please enter a new file name");
      return;
    }

    if (trimmed === fileName) {
      toast.error("File name is unchanged");
      return;
    }

    setIsRenaming(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/storage/rename`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileKey, newFileName: trimmed }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      toast.error(data?.message || "Rename failed");
      setIsRenaming(false);
      return;
    }

    toast.success("File renamed successfully!");

    onOpenChange(false);

    router.refresh();

    setIsRenaming(false);
  }, [fileKey, fileName, newFileName, onOpenChange, router]);

  const canRename = newFileName.trim() && newFileName.trim() !== fileName;

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
            if (e.key === "Enter" && canRename && !isRenaming) handleRename();
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
            disabled={!canRename || isRenaming}
            className="bg-foreground/90 text-background text-xs"
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
