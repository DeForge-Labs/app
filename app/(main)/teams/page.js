import TeamList from "@/components/layout/team/TeamList";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Team() {
  return (
    <div className="flex flex-col w-[350px]">
      <Suspense
        fallback={
          <div className="flex flex-col rounded-lg border mt-4 border-black/10 shadow-md bg-background dark:bg-foreground/5 h-[445px] dark:border-white/10">
            <div className="px-4 border-b border-black/10 dark:border-white/10 py-4">
              <p className="text-xs dark:text-foreground">Your Teams</p>
            </div>
            <Skeleton className="h-[70px] mx-4 mt-2" />
            <Skeleton className="h-[70px] mx-4 mt-2" />
            <Skeleton className="h-[70px] mx-4 mt-2" />
          </div>
        }
      >
        <TeamList />
      </Suspense>
    </div>
  );
}
