import { Suspense } from "react";
import { File, RefreshCcw } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import FileList from "@/components/layout/dashboard/files/FileList";
import SearchSection from "@/components/layout/dashboard/apps/SearchSection";
import UploadFileButton from "@/components/layout/dashboard/files/UploadFileButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Files | Deforge.io",
  description: "Manage and organize your files on Deforge.io",
};

const LOADING_SKELETON = (
  <>
    <Skeleton className="h-[114px] w-full max-w-[1360px]" />
    <Skeleton className="h-[114px] w-full max-w-[1360px]" />
    <Skeleton className="h-[114px] w-full max-w-[1360px]" />
  </>
);

const FilesPage = async ({ searchParams }) => {
  const { p, q } = await searchParams;

  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex items-center justify-between p-4 border-b border-foreground/15">
        <div className="flex gap-2">
          <File size={14} className="mt-1" aria-hidden="true" />

          <div className="flex flex-col gap-0.5">
            <h1 className="text-sm font-medium">Files</h1>

            <p className="text-xs text-foreground/50">
              Manage and organize your files on Deforge.io
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 h-full">
          <Link href={"/files"}>
            <Button
              className="flex gap-2 font-normal text-xs border border-foreground/15 rounded-sm w-fit"
              variant={"outline"}
            >
              <RefreshCcw className="size-3" />
              Refresh
            </Button>
          </Link>
          <UploadFileButton />
        </div>
      </header>

      <SearchSection route="files" placeholder="Search files..." />

      <main className="flex flex-col flex-1 relative">
        <div className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-4 flex flex-col space-y-4 items-center">
          <Suspense fallback={LOADING_SKELETON}>
            <FileList page={p} query={q} />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default FilesPage;
