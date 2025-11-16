"use client";

import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useWorkflowStore from "@/store/useWorkspaceStore";
import useFormStore from "@/store/useFormStore";
import { useState, useRef } from "react";
import { FileUp, X } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { toast } from "sonner";

export default function ImportDialog({ open, setIsOpen }) {
  const handleIsOpenChange = (open) => {
    setIsOpen(open);
  };

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { setNodes, setConnections, workflow } = useWorkflowStore();
  const { loadComponents } = useFormStore();

  const handleImport = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        let newNodes = data.nodes.map((node) => {
          return {
            ...node,
            workflowId: workflow?.id,
          };
        });

        let newConnections = data.connections.map((connection) => {
          return {
            ...connection,
            workflowId: workflow?.id,
          };
        });

        setNodes(newNodes);
        setConnections(newConnections);
        loadComponents(data.components);
        setIsOpen(false);
      } catch (error) {
        toast.error("Failed to import workspace");
        console.error(error);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (file.type !== "application/json") {
      toast.error("Only JSON files are supported");
      return;
    }

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
      if (files[0].type !== "application/json") {
        toast.error("Only JSON files are supported");
        return;
      }
      setSelectedFile(files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleIsOpenChange}>
      <DialogPopup className={"sm:max-w-sm"}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleImport();
          }}
        >
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Import Workspace
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Import your workspace from a JSON file. Click on the upload button
              to select a file.
            </DialogDescription>
          </DialogHeader>

          <div>
            {!selectedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onClick={() => {
                  fileInputRef.current?.click();
                }}
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
                  Only JSON files are supported
                </p>
              </div>
            ) : (
              <div className="border border-foreground/20 rounded-lg p-4">
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
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
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
            <DialogClose
              render={<Button variant="ghost" className="text-xs" />}
            >
              Cancel
            </DialogClose>
            <Button
              className="text-background rounded-md border-none text-xs"
              type="submit"
            >
              Import
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
