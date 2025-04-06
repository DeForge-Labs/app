"use client";

import useTeams from "@/hooks/useTeams";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@heroui/react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeamList() {
  const { getTeams } = useTeams();
  const [teams, setTeams] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
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
    <>
      <p className="mt-5 text-sm">Your Teams</p>
      <div className="h-[350px] relative w-full mt-3 overflow-hidden">
        {isFetching ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto h-full hide-scroll">
            {teams.length === 0 && (
              <p className="flex items-center justify-center h-full text-center text-black/60">
                No teams found
              </p>
            )}
            {teams.map((team) => (
              <Button
                key={team.teamId}
                className="w-full mb-2 rounded-xl py-9 px-4 border border-black/40 justify-between"
                variant="outline"
                onPress={() => router.push(`/dashboard/${team.teamId}`)}
              >
                <div className="flex flex-col items-start">
                  <p className="font-semibold text-black/80 text-lg">
                    {team.team.name}
                  </p>
                  <p className="text-black/60 text-xs">
                    Joined at {new Date(team.joinedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center capitalize bg-black/70 p-2 py-1 rounded-md text-xs text-[var(--primary)]">
                  {team.role.toLowerCase()}
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>

      <Button
        className="w-full mt-3 rounded-full p-7 border border-black/40 "
        variant="outline"
        onPress={() => {
          router.push("/team/create");
        }}
      >
        <Plus className="mr-2" /> Create Team
      </Button>
    </>
  );
}
