"use client";

import FileIconDisplay from "@/components/layout/dashboard/files/FileIconDisplay";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import useFiles from "@/hooks/useFiles";
import { FileQuestion, LinkIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function FilePicker({ field, onChange, value }) {
  const {
    files,
    loading,
    getFiles,
    query,
    setQuery,
    page,
    setPage,
    paginationData,
  } = useFiles();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const createdAt = new Date(value?.createdAt || Date.now());

  const uploadedTimeAgo = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  const handleOpenChange = (open) => {
    setOpen(open);
  };

  useEffect(() => {
    if (open) {
      getFiles(1, query);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          !value ? (
            <Button className={"w-full text-[10px] rounded-sm"}>
              Choose File
            </Button>
          ) : (
            <Button
              variant={"ghost"}
              className={
                "flex flex-col relative hover:cursor-pointer gap-2 border w-full border-foreground/15 rounded-sm p-2 bg-foreground/2 hover:shadow-sm transition-shadow shadow-foreground/10 max-w-[1360px]"
              }
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileIconDisplay
                    fileKey={value.fileKey}
                    fileName={value.fileName}
                  />

                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <p
                      title={value.fileName}
                      className="font-medium text-[10px] truncate"
                    >
                      {value.fileName}
                    </p>

                    <p className="text-[10px] text-left text-foreground/60">
                      {uploadedTimeAgo}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <p className="text-[10px] text-left w-full text-foreground/60">
                Click to change file
              </p>
            </Button>
          )
        }
      ></SheetTrigger>
      <SheetPopup className="">
        <Form className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className={"text-lg font-medium opacity-80"}>
              Choose File
            </SheetTitle>
            <SheetDescription className={"text-xs -mt-1"}>
              Choose a file from your file library
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col flex-1 px-6">
            <div className="flex items-center gap-2 -mt-5 mb-2">
              <Search className="w-4 h-4 opacity-80" />
              <Input
                placeholder="Search files..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={""}
              />
            </div>

            {loading && (
              <div className="flex flex-col gap-3 mt-3">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            )}

            {!loading && files.length === 0 && (
              <div
                className={cn(
                  "flex flex-col items-center justify-center h-[200px] bg-foreground/2 w-full max-w-[1360px] border border-foreground/15 border-dashed rounded-sm p-4 py-6 gap-2",
                  value && "bg-foreground/5"
                )}
              >
                <div className="p-4 bg-background rounded-sm border border-foreground/15">
                  <FileQuestion className="w-5 h-5 opacity-70" />
                </div>
                <p className="text-center text-foreground/70 text-sm mt-2">
                  No files found
                </p>

                <Link href={`/files`} target="_blank">
                  <Button className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit">
                    Upload a file
                  </Button>
                </Link>
              </div>
            )}

            <div className="flex-1 overflow-y-auto h-full relative hide-scroll mt-3">
              {!loading && files.length > 0 && (
                <div className="flex flex-col gap-3 w-full absolute top-0 left-0">
                  {files.map((file, index) => {
                    const createdAt = new Date(file.createdAt || Date.now());

                    const uploadedTimeAgo = formatDistanceToNow(createdAt, {
                      addSuffix: true,
                    });

                    return (
                      <div
                        key={file.fileKey || index}
                        onClick={() => setSelectedFile(file)}
                        className={cn(
                          "flex flex-col relative hover:cursor-pointer gap-2 border w-full border-foreground/15 rounded-sm p-4 bg-foreground/2 hover:shadow-sm transition-shadow shadow-foreground/10 max-w-[1360px]",
                          selectedFile?.fileKey === file.fileKey &&
                            "bg-foreground/5 border-foreground"
                        )}
                      >
                        {value && value?.fileKey === file?.fileKey && (
                          <div className="absolute -top-2 right-1 p-0.5 px-1 text-[10px] rounded-sm bg-foreground text-background">
                            Selected
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileIconDisplay
                              fileKey={file.fileKey}
                              fileName={file.fileName}
                            />

                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                              <p
                                title={file.fileName}
                                className="font-medium text-xs truncate"
                              >
                                {file.fileName}
                              </p>

                              <div className="flex items-center gap-2 text-[10px] text-foreground/70">
                                {file.fileSize && (
                                  <span>{formatFileSize(file.fileSize)}</span>
                                )}

                                {file.fileSize && <span>•</span>}
                                <span>Uploaded {uploadedTimeAgo}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-2 bg-foreground/15" />

                        <div className="flex justify-between items-center -mt-2 -mb-1">
                          <div className="flex items-center gap-3">
                            {file.sourceUrl && (
                              <div className="flex items-center gap-1.5">
                                <LinkIcon className="w-3 h-3 text-foreground/50" />

                                <Link
                                  href={file.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-foreground/70 hover:text-foreground/90 hover:underline truncate max-w-[200px]"
                                  title={file.sourceUrl}
                                >
                                  {file.sourceUrl}
                                </Link>
                              </div>
                            )}
                          </div>

                          {file?.ragStatus !== "done" ? (
                            <Badge
                              className={
                                "w-fit text-[10px] p-1 py-0.5 opacity-80"
                              }
                              variant="destructive"
                            >
                              RAG Not Processed
                            </Badge>
                          ) : (
                            <Badge className="w-fit text-[10px] p-1 py-0.5 opacity-80">
                              RAG Processed
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {paginationData && paginationData.totalPages > 1 && (
              <div className="flex items-center justify-between py-2 pt-4 border-t border-foreground/10">
                <p className="text-[10px] text-foreground/60">
                  Page {paginationData.currentPage} of{" "}
                  {paginationData.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    disabled={!paginationData.hasPreviousPage || loading}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    disabled={!paginationData.hasNextPage || loading}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
          <SheetFooter className={"sm:justify-between"}>
            <Link href={`/files`} target="_blank">
              <Button
                className="rounded-md border-none text-xs border-foreground/15 border border-dashed"
                variant="outline"
              >
                Upload
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <SheetClose
                render={<Button variant="ghost" className="text-xs" />}
              >
                Cancel
              </SheetClose>
              <Button
                className="text-background rounded-md border-none text-xs"
                type="submit"
                onClick={() => {
                  if (selectedFile?.ragStatus !== "done") {
                    toast(
                      <div className="text-xs flex gap-2 items-center justify-between w-full">
                        File is not processed yet!
                        <Button
                          className="text-xs"
                          variant="outline"
                          onClick={() => window.open(`/files`, "_blank")}
                        >
                          Go to Files
                        </Button>
                      </div>
                    );
                    return;
                  }

                  onChange(field.name, selectedFile);
                  setOpen(false);
                }}
                disabled={!selectedFile}
              >
                Select
              </Button>
            </div>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  );
}
