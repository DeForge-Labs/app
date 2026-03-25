import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import GlobalTemplateList from "@/components/layout/dashboard/templates/GlobalTemplateList";
import TemplatesHeader from "@/components/layout/dashboard/templates/TemplatesHeader";
import { generateCategorySlug } from "@/lib/utils";

const categoryListItems = [
  "General",
  "Customer Support",
  "Career & Job Search",
  "Social Media Automation",
  "Productivity",
  "Content Creation",
  "Ecommerce",
  "Social Media & Marketing",
  "Utilities",
  "Audio & Content Creation",
  "Misc",
  "Programming",
];

export default async function CategoryPage({ params, searchParams }) {
  const { id, category } = await params;
  const { p, q } = await searchParams;

  const decodedCategorySlug = decodeURIComponent(category || "");

  const resolvedCategoryName =
    categoryListItems.find(
      (c) => generateCategorySlug(c) === decodedCategorySlug,
    ) || decodedCategorySlug;

  return (
    <div className="flex flex-col flex-1 relative w-full h-full">
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#DFE0E8_1.2px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] dark:bg-[radial-gradient(#232323_1.2px,transparent_1px)]" />

      <div className="absolute inset-0 z-10 overflow-hidden overflow-y-auto hide-scroll flex flex-col items-center py-4 px-4 sm:px-8">
        <TemplatesHeader categoryName={resolvedCategoryName} />

        <Suspense
          key={`${p}-${q}-${resolvedCategoryName}`}
          fallback={
            <div className="w-full max-w-[1390px] mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[237px] w-full" />
                ))}
              </div>
            </div>
          }
        >
          <GlobalTemplateList
            page={p}
            query={q}
            teamId={id}
            category={resolvedCategoryName}
          />
        </Suspense>
      </div>
    </div>
  );
}
