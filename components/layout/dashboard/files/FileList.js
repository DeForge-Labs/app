import { cookies } from "next/headers";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileX, SearchX, Upload, X } from "lucide-react";
import Link from "next/link";
import FileMenuBox from "./FileMenuBox";
import FileIconDisplay from "./FileIconDisplay";
import PageSection from "../apps/PageSection";
import UploadFileButton from "./UploadFileButton";
import { formatFileSize } from "@/lib/utils";

export default async function FileList({ page, query }) {
  const getFiles = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(`${process.env.API_URL}/storage/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched files data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching files:", error);
      return null;
    }
  };

  const filesData = await getFiles();

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

  // Client-side filtering for search
  if (query) {
    files = files.filter((file) =>
      file.fileName.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Client-side pagination
  const limit = 10;
  const currentPage = parseInt(page) || 1;
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const totalFiles = files.length;
  const totalPages = Math.ceil(totalFiles / limit);
  const paginatedFiles = files.slice(startIndex, endIndex);

  return (
    <>
      {/* No results found with search query */}
      {paginatedFiles.length === 0 && query && (
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

      {/* No files uploaded yet */}
      {paginatedFiles.length === 0 && !query && (
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

      {/* File list */}
      {paginatedFiles.map((file, index) => {
        const createdAt = new Date(file.createdAt || Date.now());
        const uploadedTimeAgo = formatDistanceToNow(createdAt, {
          addSuffix: true,
        });

        return (
          <div
            className="flex flex-col relative gap-2 border w-full border-foreground/15 rounded-sm p-4 bg-foreground/2 hover:shadow-sm transition-shadow shadow-foreground/10 max-w-[1360px]"
            key={file.fileKey || index}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* File icon/preview */}
                <FileIconDisplay
                  fileName={file.fileName}
                  fileKey={file.fileKey}
                />

                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p
                    className="font-medium text-sm truncate"
                    title={file.fileName}
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

              {/* File menu - positioned relatively to stay above overlay */}
              <div className="relative z-10">
                <FileMenuBox
                  fileKey={file.fileKey}
                  fileName={file.fileName}
                  ragStatus={file.ragStatus}
                  ragTableName={file.ragTableName}
                />
              </div>
            </div>

            <Separator className="my-2 bg-foreground/15" />

            <div className="flex justify-between items-center -mt-2 -mb-1">
              <p className="text-[10px] text-foreground/70">
                Bucket: {file.bucket || "upload"}
              </p>

              {file.ragStatus && (
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      file.ragStatus === "done"
                        ? "bg-green-500"
                        : file.ragStatus === "processing" ||
                          file.ragStatus === "queued"
                        ? "bg-yellow-500"
                        : file.ragStatus === "failed"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <p className="text-[10px] text-foreground/60 capitalize">
                    RAG: {file.ragStatus || "not-requested"}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Pagination */}
      {totalFiles > 0 && (
        <PageSection
          totalPages={totalPages}
          totalWorkspaces={totalFiles}
          page={page}
          query={query}
          route="files"
          topLimit={10}
        />
      )}
    </>
  );
}
