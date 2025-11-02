import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SearchSection from "@/components/layout/dashboard/apps/SearchSection";
import YourTemplateList from "@/components/layout/dashboard/templates/YourTemplateList";

export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const { p, q } = await searchParams;
  return (
    <>
      <SearchSection
        route="templates/published"
        placeholder="Search templates..."
      />

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
              <YourTemplateList teamId={id} page={p} query={q} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
