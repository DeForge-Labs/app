"use client";

import useTeams from "@/hooks/useTeams";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TeamList() {
  const { getTeams } = useTeams();
  const [teams, setTeams] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  const handleGetTeams = async () => {
    setIsFetching(true);
    try {
      const teams = await getTeams();
      setTeams(teams);
    } catch (error) {
      toast.error("Failed to get teams");
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    handleGetTeams();
  }, [user]);

  return (
    <div className="flex flex-col rounded-lg mt-4 border border-black/10 shadow-md bg-background">
      <div className="px-4 border-b border-black/10 py-4">
        <p className="text-xs dark:text-background">Your Teams</p>
      </div>
      <div className="h-[350px] relative w-full overflow-hidden dark:text-background">
        {isFetching ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto h-full hide-scroll">
            {!teams ||
              (teams?.length === 0 && (
                <p className="flex items-center justify-center h-full text-center text-black/60 dark:text-background">
                  No teams found
                </p>
              ))}
            {teams &&
              teams.map((team) => (
                <Button
                  key={team.teamId}
                  className="w-full mb-2 rounded-none py-4 shadow-none px-4 border-b border-x-0 border-t-0 border-black/10 justify-between dark:border-background dark:text-background text-xs"
                  variant="outline"
                  onClick={() => {
                    router.push(`/dashboard/${team.teamId}`);
                    localStorage.setItem(`team_${user.id}`, team.teamId);
                  }}
                >
                  <div className="flex flex-col items-start">
                    <p className="font-semibold text-black/80 text-sm dark:text-background">
                      {team.team.name.length > 15
                        ? team.team.name.slice(0, 15) + "..."
                        : team.team.name}
                    </p>
                    <p className="text-black/60 text-[10px] dark:text-background">
                      Joined at {new Date(team.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              ))}
          </div>
        )}
      </div>

      <Button
        className="h-11 flex-1 dark:bg-background dark:text-foreground border-t py-3 border-x-0 border-b-0 border-black/10 dark:border-foreground text-info items-start justify-start px-4 rounded-lg rounded-t-none text-xs"
        variant="outline"
        onClick={() => {
          router.push("/team/create");
        }}
      >
        <Plus className="h-3 w-3" /> Create or Join Team
      </Button>
    </div>
  );
}
