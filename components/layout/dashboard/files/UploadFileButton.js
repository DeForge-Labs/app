"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import UploadFileDialog from "./UploadFileDialog";

const UploadFileButton = () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowUploadDialog(true)}
        className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit"
      >
        <Upload size={14} />
        Upload File
      </Button>

      <UploadFileDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />
    </>
  );
};

export default UploadFileButton;
