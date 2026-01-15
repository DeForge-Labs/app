import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import TeamMembers from "./TeamMembers";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AddMemberButton from "./AddMemberButton";

export default async function TeamView({ params }) {
  const { id } = await params;
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-4 border-b border-foreground/15">
        <div className="flex gap-2">
          <Users size={14} className="mt-1" />

          <div className="flex flex-col gap-0.5">
            <h1 className="text-sm font-medium">Team Members</h1>
            <p className="text-xs text-foreground/50">
              Manage your team members and their roles
            </p>
          </div>
        </div>

        <AddMemberButton teamId={id} />
      </div>

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
              <TeamMembers id={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
