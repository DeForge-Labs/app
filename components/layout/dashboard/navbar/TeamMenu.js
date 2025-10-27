import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
  MenuItem,
} from "@/components/ui/menu";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import TeamRadioButton from "./TeamRadioButton";

export default async function TeamMenu({ params }) {
  const { id } = await params;

  const getTeam = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/team/get/${id}`,
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

  const teamData = await getTeam();

  const teamsData = await getAllTeams();

  if (!teamData || !teamsData) {
    // TODO: Go To Server Not Found Route
    console.log("Server Error");
    return null;
  }

  if (!teamData?.success || !teamsData?.success) {
    redirect("/");
  }

  const currentTeam = teamData?.team;

  const teams = teamsData?.teams;

  return (
    <>
      <Menu>
        <MenuTrigger
          render={
            <Button
              variant="outline"
              className={
                "shadow-none border-none before:shadow-none font-normal text-xs rounded-sm [&_svg:not([class*='size-'])]:size-3"
              }
            />
          }
          className="-ml-3 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none bg-transparent dark:bg-transparent [&:is(:hover,[data-pressed])]:!bg-foreground/5 "
        >
          <p className="text-sm text-foreground">{currentTeam?.name}</p>
          <Badge
            variant="outline"
            className="text-[10px] p-1 px-2 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
          >
            {currentTeam?.owner?.plan?.toLowerCase()}
          </Badge>
          <ChevronsUpDown className=" text-foreground/70" />
        </MenuTrigger>
        <MenuPopup
          sideOffset={5}
          className={
            "bg-foreground/5 dark:bg-popover rounded-lg w-[200px] border border-foreground/30"
          }
          align="start"
        >
          <MenuRadioGroup value={currentTeam?.id}>
            {teams?.map((team, index) => {
              return <TeamRadioButton key={index} team={team} />;
            })}
          </MenuRadioGroup>
          <MenuSeparator className="bg-foreground/10" />
          <Link href="/team">
            <MenuItem className="text-info data-highlighted:bg-foreground/5 data-highlighted:text-info cursor-pointer">
              <Plus size={16} />
              Create / Join
            </MenuItem>
          </Link>
        </MenuPopup>
      </Menu>
    </>
  );
}
