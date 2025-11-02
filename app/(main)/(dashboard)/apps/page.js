import { Button } from "@/components/ui/button";
import { LayoutGrid, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AppList from "@/components/layout/dashboard/apps/AppList";
import SearchSection from "@/components/layout/dashboard/apps/SearchSection";

export default async function Page({ searchParams }) {
  const { p, q } = await searchParams;
  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between p-4 border-b border-foreground/15">
          <div className="flex gap-2">
            <LayoutGrid size={14} className="mt-1" />

            <div className="flex flex-col gap-0.5">
              <h1 className="text-sm font-medium">Apps</h1>
              <p className="text-xs text-foreground/50">
                Manage your apps and their settings
              </p>
            </div>
          </div>

          <Link href={`/dashboard`}>
            <Button className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit">
              <Plus />
              New App
            </Button>
          </Link>
        </div>

        <SearchSection />

        <div className="flex flex-col flex-1 relative">
          <div className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-4">
            <div className="flex flex-col space-y-4 items-center">
              <Suspense
                fallback={
                  <>
                    <Skeleton className="h-[114px] w-full max-w-[1360px]" />
                    <Skeleton className="h-[114px] w-full max-w-[1360px]" />
                  </>
                }
              >
                <AppList page={p} query={q} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
