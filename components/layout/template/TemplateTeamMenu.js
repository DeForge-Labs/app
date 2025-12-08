import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Plus, ChevronsUpDown } from "lucide-react";

import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
  MenuSeparator,
  MenuRadioGroup,
} from "@/components/ui/menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TeamMenuList from "../dashboard/navbar/TeamMenuList";
import FeedbackDialog from "../dashboard/navbar/FeedbackDialog";
import SettingsMenu from "../dashboard/navbar/SettingsMenu";
import LoginDialog from "./LoginDialog";

const getTeamData = async () => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(`${process.env.API_URL}/team/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      credentials: "include",
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch team data:", error);
    return null;
  }
};

const TemplateTeamMenu = async () => {
  const teamData = await getTeamData();

  if (!teamData) {
    redirect("/server-not-found");
  }

  if (!teamData?.success) {
    return (
      <div className="flex items-center gap-2 justify-between w-full">
        <p className="text-lg font-bold text-foreground">Deforge</p>

        <div className="flex items-center gap-2">
          <FeedbackDialog />
          <SettingsMenu isTemplate />
          <LoginDialog />
        </div>
      </div>
    );
  }

  const currentTeam = teamData?.team;

  if (!currentTeam || !currentTeam.id) {
    return (
      <div className="flex items-center gap-2 justify-between w-full">
        <p className="text-lg font-bold text-foreground">Deforge</p>

        <div className="flex items-center gap-2">
          <FeedbackDialog />
          <SettingsMenu isTemplate />
          <LoginDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-between w-full">
      <Menu>
        <MenuTrigger
          aria-label="Team menu"
          className="-ml-3 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none bg-transparent dark:bg-transparent [:hover,[data-pressed]]:bg-foreground/5!"
          render={
            <Button
              variant="outline"
              className={
                "shadow-none border-none before:shadow-none font-normal text-xs rounded-sm [&_svg:not([class*='size-'])]:size-3"
              }
            />
          }
        >
          <span className="text-sm text-foreground">{currentTeam?.name}</span>

          {currentTeam.owner?.plan && (
            <Badge
              variant="outline"
              className="text-[10px] p-1 px-2 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
            >
              {currentTeam.owner.plan.toLowerCase()}
            </Badge>
          )}

          <ChevronsUpDown className=" text-foreground/70" />
        </MenuTrigger>

        <MenuPopup
          align="start"
          sideOffset={5}
          className="bg-foreground/5 dark:bg-popover rounded-lg w-52 border border-foreground/30"
        >
          <MenuRadioGroup value={currentTeam?.id}>
            <Suspense
              fallback={
                <>
                  <Skeleton className="h-9" />
                  <Skeleton className="h-9 mt-1" />
                </>
              }
            >
              <TeamMenuList />
            </Suspense>
          </MenuRadioGroup>

          <MenuSeparator className="bg-foreground/10" />

          <Link href="/teams">
            <MenuItem className="text-info data-highlighted:bg-foreground/5 data-highlighted:text-info cursor-pointer">
              <Plus size={16} />
              Create / Join
            </MenuItem>
          </Link>
        </MenuPopup>
      </Menu>

      <div className="flex items-center gap-2">
        <FeedbackDialog />
        <SettingsMenu isTemplate />
      </div>
    </div>
  );
};

export default TemplateTeamMenu;
