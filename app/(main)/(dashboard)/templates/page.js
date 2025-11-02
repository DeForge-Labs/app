import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SearchSection from "@/components/layout/dashboard/apps/SearchSection";
import GlobalTemplateList from "@/components/layout/dashboard/templates/GlobalTemplateList";

export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const { p, q } = await searchParams;
  return (
    <>
      <SearchSection route="templates" placeholder="Search templates..." />

      <div className="flex flex-col flex-1 relative">
        <div className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll flex flex-col items-center py-4">
          <Suspense
            fallback={
              <div className="w-full max-w-[1390px]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
                  <Skeleton className="h-[237px] w-full" />
                  <Skeleton className="h-[237px] w-full" />
                  <Skeleton className="h-[237px] w-full" />
                  <Skeleton className="h-[237px] w-full" />
                  <Skeleton className="h-[237px] w-full" />
                  <Skeleton className="h-[237px] w-full" />
                </div>
              </div>
            }
          >
            <GlobalTemplateList page={p} query={q} teamId={id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
