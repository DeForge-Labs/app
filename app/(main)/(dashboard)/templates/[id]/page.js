import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import TemplatePage from "@/components/layout/dashboard/templates/TemplatePage";
import { Separator } from "@/components/ui/separator";

export default async function Page({ params }) {
  const { id } = await params;
  return (
    <div className="flex flex-col flex-1 relative">
      <div className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-4 flex justify-center">
        <div className="flex flex-col gap-4 max-w-[1360px] w-full">
          <Suspense
            fallback={
              <>
                <Breadcrumb>
                  <BreadcrumbList>
                    <Skeleton className="w-24 h-6" />
                    <BreadcrumbSeparator>/</BreadcrumbSeparator>

                    <BreadcrumbItem>
                      <Skeleton className="w-24 h-6" />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>/</BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <Skeleton className="w-24 h-6" />
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <div className="flex justify-between items-end gap-2">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-24 h-[36px]" />
                    <div className="flex gap-2 text-[10px] items-center">
                      <Skeleton className="w-24 h-[21px]" />

                      <Skeleton className="w-24 h-[21px]" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Skeleton className="w-24 h-[32px]" />

                    <Skeleton className="w-24 h-[32px]" />
                  </div>
                </div>

                <Skeleton className="w-full min-h-[700px]" />

                <div className="flex flex-col max-w-[600px] gap-2">
                  <p className="text-[12px] font-semibold">About</p>
                  <Skeleton className="w-full h-[54px]" />

                  <p className="text-[12px] font-semibold mt-4">Category</p>
                  <Skeleton className="w-[200px] h-[24px]" />

                  <Separator className="mt-4 mb-2" />

                  <Skeleton className="w-[200px] h-[24px] pb-6" />
                </div>
              </>
            }
          >
            <TemplatePage id={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
