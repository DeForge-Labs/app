import Link from "next/link";
import { cookies } from "next/headers";
import { formatDistanceToNow } from "date-fns";
import { FileX, SearchX, X, Link as LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import PageSection from "../apps/PageSection";

import FileMenuBox from "./FileMenuBox";
import FileIconDisplay from "./FileIconDisplay";
import UploadFileButton from "./UploadFileButton";
import RagStatusDisplay from "./RagStatusDisplay";
import ScrapeStatusDisplay from "./ScrapeStatusDisplay";

import { formatFileSize } from "@/lib/utils";

const getFilesData = async (page) => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const currentPage = parseInt(page) || 1;
    const limit = 10;

    const response = await fetch(
      `${process.env.API_URL}/storage/list?page=${currentPage}&limit=${limit}&t=${Date.now()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieHeader,
          Pragma: "no-cache",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching files:", error);
    return null;
  }
};

const FileList = async ({ page, query }) => {
  const filesData = await getFilesData(page);

  if (!filesData || !filesData.success) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-foreground/2 w-full max-w-[1360px] border border-foreground/15 border-dashed rounded-sm p-4 py-6 gap-2">
        <div className="p-4 bg-background rounded-sm border border-foreground/15">
          <FileX className="w-5 h-5 opacity-70" />
        </div>

        <p className="text-center text-foreground/70 text-sm mt-2">
          Failed to load files. Please try again.
        </p>
      </div>
    );
  }

  let files = filesData.files || [];
  const pagination = filesData.pagination || {};

  if (query) {
    files = files.filter((file) =>
      file.fileName.toLowerCase().includes(query.toLowerCase()),
    );
  }

  const currentPage = parseInt(page) || 1;

  const totalPages = query
    ? Math.ceil(files.length / 10)
    : pagination.totalPages;
  const totalFiles = query ? files.length : pagination.totalFiles;

  let displayFiles = files;

  if (query) {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;

    displayFiles = files.slice(startIndex, endIndex);
  }

  return (
    <>
      {displayFiles.length === 0 && query && (
        <div className="flex flex-col items-center justify-center h-full bg-foreground/2 w-full max-w-[1360px] border border-foreground/15 border-dashed rounded-sm p-4 py-6 gap-2">
          <div className="p-4 bg-background rounded-sm border border-foreground/15">
            <SearchX className="w-5 h-5 opacity-70" />
          </div>

          <p className="text-center text-foreground/70 text-sm mt-2">
            No files found based on your search.
          </p>

          <Link href="/files">
            <Button className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit">
              <X size={14} />
              Clear Search
            </Button>
          </Link>
        </div>
      )}

      {displayFiles.length === 0 && !query && (
        <div className="flex flex-col items-center justify-center h-full bg-foreground/2 w-full max-w-[1360px] border border-foreground/15 border-dashed rounded-sm p-4 py-6 gap-2">
          <div className="p-4 bg-background rounded-sm border border-foreground/15">
            <FileX className="w-5 h-5 opacity-70" />
          </div>

          <p className="text-center text-foreground/70 text-sm mt-2">
            You haven't uploaded any files yet.
          </p>

          <UploadFileButton />
        </div>
      )}

      {displayFiles.map((file, index) => {
        const createdAt = new Date(file.createdAt || Date.now());

        const uploadedTimeAgo = formatDistanceToNow(createdAt, {
          addSuffix: true,
        });

        return (
          <div
            key={file.fileKey || index}
            className="flex flex-col relative gap-2 border w-full border-foreground/15 rounded-sm p-4 bg-foreground/2 hover:shadow-sm transition-shadow shadow-foreground/10 max-w-[1360px]"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileIconDisplay
                  fileKey={file.fileKey}
                  fileName={file.fileName}
                />

                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p
                    title={file.fileName}
                    className="font-medium text-sm truncate"
                  >
                    {file.fileName}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-foreground/70">
                    {file.fileSize && (
                      <span>{formatFileSize(file.fileSize)}</span>
                    )}

                    {file.fileSize && <span>•</span>}
                    <span>Uploaded {uploadedTimeAgo}</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <FileMenuBox
                  fileKey={file.fileKey}
                  fileName={file.fileName}
                  ragStatus={file.ragStatus}
                  sourceUrl={file.sourceUrl}
                  ragTableName={file.ragTableName}
                  scrapeStatus={file.scrapeStatus}
                />
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

              <div className="flex items-center gap-3">
                {file.sourceUrl && (
                  <ScrapeStatusDisplay
                    fileKey={file.fileKey}
                    scrapeStatus={file.scrapeStatus}
                  />
                )}

                {(file.sourceUrl ? file.scrapeStatus === "done" : true) &&
                  file.ragStatus && (
                    <RagStatusDisplay
                      fileKey={file.fileKey}
                      initialRagStatus={file.ragStatus}
                    />
                  )}
              </div>
            </div>
          </div>
        );
      })}

      {totalFiles > 0 && (
        <PageSection
          page={page}
          query={query}
          topLimit={10}
          route="files"
          totalPages={totalPages}
          totalWorkspaces={totalFiles}
        />
      )}
    </>
  );
};

export default FileList;
