"use client";

import { useState } from "react";
import {
  MoreVertical,
  Download,
  Edit,
  Trash2,
  Database,
  Eye,
} from "lucide-react";
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuItem,
  MenuSeparator,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import DeleteFileDialog from "./DeleteFileDialog";
import EditFileDialog from "./EditFileDialog";
import RagConversionDialog from "./RagConversionDialog";
import axios from "axios";
import { toast } from "sonner";

export default function FileMenuBox({
  fileKey,
  fileName,
  ragStatus,
  ragTableName,
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRagDialog, setShowRagDialog] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await axios.post(
        "/api/storage/download",
        { fileKey },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Open the signed URL in a new tab to trigger download
        window.open(response.data.fileURL, "_blank");
        toast.success("Download started");
      } else {
        toast.error(response.data.message || "Download failed");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.response?.data?.message || "Failed to download file");
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditDialog(true);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleRagConversion = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRagDialog(true);
  };

  const handleViewRagStatus = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRagDialog(true);
  };

  return (
    <>
      <Menu>
        <MenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-sm hover:bg-foreground/5"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open file menu</span>
          </Button>
        </MenuTrigger>

        <MenuPopup align="end" className="w-48">
          <MenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </MenuItem>

          <MenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </MenuItem>

          <MenuSeparator />

          {ragStatus === "done" ? (
            <MenuItem onClick={handleViewRagStatus}>
              <Eye className="mr-2 h-4 w-4" />
              <span>View RAG Status</span>
            </MenuItem>
          ) : (
            <MenuItem onClick={handleRagConversion}>
              <Database className="mr-2 h-4 w-4" />
              <span>Convert to RAG</span>
            </MenuItem>
          )}

          <MenuSeparator />

          <MenuItem onClick={handleDelete} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </MenuItem>
        </MenuPopup>
      </Menu>

      <DeleteFileDialog
        fileKey={fileKey}
        fileName={fileName}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />

      <EditFileDialog
        fileKey={fileKey}
        fileName={fileName}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <RagConversionDialog
        fileKey={fileKey}
        fileName={fileName}
        ragStatus={ragStatus}
        ragTableName={ragTableName}
        open={showRagDialog}
        onOpenChange={setShowRagDialog}
      />
    </>
  );
}
