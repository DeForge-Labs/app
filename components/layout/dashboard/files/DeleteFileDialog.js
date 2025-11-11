"use client";

import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/storage/delete`,
        {
          data: { fileKey },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("File deleted successfully!");

        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(response.data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while deleting"
      );
    } finally {
      setIsDeleting(false);
    }
  };

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
