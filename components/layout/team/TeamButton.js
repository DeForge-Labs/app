"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { updateLastTeamIdCookie } from "@/actions/updateTeamId";

export default function TeamButton({ team }) {
  return (
    <Button
      className="w-full before:rounded-none rounded-none py-4 shadow-none px-4 border-b border-x-0 border-t-0 border-black/10 justify-between dark:border-white/10 dark:bg-transparent dark:text-foreground text-xs"
      variant="outline"
      onClick={() => {
        updateLastTeamIdCookie(team.teamId);
      }}
    >
      <div className="flex flex-col items-start">
        <p className="font-semibold text-black/80 text-sm dark:text-foreground">
          {team.team.name.length > 15
            ? team.team.name.slice(0, 15) + "..."
            : team.team.name}
        </p>
        <p className="text-black/60 text-[10px] dark:text-foreground">
          Joined at {new Date(team.joinedAt).toLocaleDateString()}
        </p>
      </div>
      <ChevronRight className="h-3 w-3 dark:text-foreground" />
    </Button>
  );
}
