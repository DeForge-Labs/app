"use client";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteFileDialog = ({ fileKey, fileName, open, onOpenChange }) => {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/storage/delete`,
      {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ fileKey }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      toast.error(data?.message || "Delete failed");
      setIsDeleting(false);

      return;
    }

    toast.success("File deleted successfully!");

    onOpenChange(false);

    router.refresh();

    setIsDeleting(false);
  }, [fileKey, onOpenChange, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium opacity-80">
            Delete File
          </DialogTitle>

          <DialogDescription className="text-xs">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{fileName}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="ghost"
            className="text-xs"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white text-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFileDialog;
