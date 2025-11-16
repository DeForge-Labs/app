"use client";

import { toast } from "sonner";
import { useState, useCallback } from "react";
import { Eye, Edit, Trash2, Download, Database, Ellipsis } from "lucide-react";

import {
  Menu,
  MenuPopup,
  MenuTrigger,
  MenuSeparator,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";

import EditFileDialog from "./EditFileDialog";
import DeleteFileDialog from "./DeleteFileDialog";
import RagConversionDialog from "./RagConversionDialog";

const baseMenuBtn =
  "data-highlighted:bg-foreground/5 px-2 min-h-5 font-normal rounded-sm text-xs cursor-pointer dark:bg-transparent shadow-none hover:bg-transparent w-full justify-start border-none text-foreground/80 [&_svg:not([class*='size-'])]:size-3";

const FileMenuBox = ({ fileKey, fileName, ragStatus, ragTableName }) => {
  const [showRagDialog, setShowRagDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDownload = useCallback(
    async (e) => {
      stop(e);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/storage/download`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileKey }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data?.message || "Download failed");
        return;
      }

      toast.success("Download started");
      window.open(data.fileURL, "_blank");
    },
    [fileKey]
  );

  const handleEdit = useCallback((e) => {
    stop(e);
    setShowEditDialog(true);
  }, []);

  const handleDelete = useCallback((e) => {
    stop(e);
    setShowDeleteDialog(true);
  }, []);

  const handleRagConversion = useCallback((e) => {
    stop(e);
    setShowRagDialog(true);
  }, []);

  return (
    <>
      <Menu>
        <MenuTrigger
          render={
            <Button
              variant="outline"
              className="flex gap-2 bg-transparent font-normal px-1 min-h-4 !pointer-coarse:after:min-h-4 h-5 w-fit z-10 shadow-none! [:hover,[data-pressed]]:bg-foreground/5 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60 border border-foreground/15"
            />
          }
        >
          <Ellipsis />
          <span className="sr-only">Open file menu</span>
        </MenuTrigger>

        <MenuPopup
          align="end"
          className="border border-foreground/30 rounded-lg w-40 bg-background"
        >
          <Button
            variant="outline"
            className={baseMenuBtn}
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>

          <Button
            variant="outline"
            className={baseMenuBtn}
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
            <span>Rename</span>
          </Button>

          <MenuSeparator />

          {ragStatus === "done" ? (
            <Button
              variant="outline"
              className={baseMenuBtn}
              onClick={handleRagConversion}
            >
              <Eye className="h-4 w-4" />
              <span>View RAG Status</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className={baseMenuBtn}
              onClick={handleRagConversion}
            >
              <Database className="h-4 w-4" />
              <span>Convert to RAG</span>
            </Button>
          )}

          <Button
            variant="outline"
            className={`${baseMenuBtn} text-destructive`}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
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
};

export default FileMenuBox;
