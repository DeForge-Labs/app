import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import TeamButton from "./TeamButton";

export default async function TeamList() {
  const getAllTeams = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            cookie: cookieHeader,
          },
          credentials: "include",
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const teamsData = await getAllTeams();

  if (!teamsData) {
    redirect("/");
  }

  const teams = teamsData.teams;

  return (
    <div className="flex flex-col rounded-lg mt-4 border border-black/10 shadow-md bg-background dark:bg-foreground/5 dark:border-white/10">
      <div className="px-4 border-b border-black/10 dark:border-white/10 py-4">
        <p className="text-xs dark:text-foreground">Your Teams</p>
      </div>
      <div className="h-[350px] relative w-full overflow-hidden dark:text-foreground">
        <div className="flex flex-col overflow-y-auto h-full hide-scroll">
          {!teams ||
            (teams?.length === 0 && (
              <p className="flex items-center justify-center h-full text-center text-black/60 dark:text-foreground">
                No teams found
              </p>
            ))}
          {teams &&
            teams.map((team) => (
              <Link href={`/dashboard/${team.teamId}`} key={team.teamId}>
                <TeamButton team={team} />
              </Link>
            ))}
        </div>
      </div>

      <Link href="/team/create" className="w-full">
        <Button
          className="h-11 flex-1 dark:bg-transparent before:rounded-t-none w-full dark:border-white/10 border-t py-3 border-x-0 border-b-0 border-black/10 text-info items-start justify-start px-4 rounded-b-lg rounded-t-none text-xs"
          variant="outline"
        >
          <Plus className="h-3 w-3" /> Create or Join Team
        </Button>
      </Link>
    </div>
  );
}
