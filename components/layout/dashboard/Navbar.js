"use client";

import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import ThemeChanger from "./ThemeChanger";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import CreateWorkflowButton from "./CreateWorkflowButton";

export default function Navbar() {
  const router = useRouter();
  const isTeamInitializing = useSelector(
    (state) => state.team.isTeamInitializing
  );
  const team = useSelector((state) => state.team.team);
  return (
    <header className="sticky top-0 z-50 border-b border-black/50 dark:border-background bg-black/5 dark:bg-white/5">
      <div className="flex items-center justify-between h-14 px-6">
        <div className="flex items-center gap-2">
          <span className="text-md font-semibold mt-0.5 flex items-center gap-1 dark:text-background">
            {isTeamInitializing ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <>
                <p>{team?.name}</p>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeChanger />
          <Button
            variant="outline"
            size="md"
            className="border border-black/50 h-9 rounded-lg text-black/80 text-xs dark:text-background dark:border-background"
            onPress={() => {
              router.push(`/team`);
            }}
          >
            <Users size={16} />
            Teams
          </Button>

          <CreateWorkflowButton />
        </div>
      </div>
    </header>
  );
}
