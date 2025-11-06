import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CircleDot, ExternalLink } from "lucide-react";

import BuyCreditDialog from "./BuyCreditDialog";

import {
  Menu,
  MenuItem,
  MenuGroup,
  MenuPopup,
  MenuTrigger,
  MenuSeparator,
  MenuGroupLabel,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import ErrorDialog from "@/components/ui/ErrorDialog";

const CreditMenu = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const teamId = cookieStore.get("lastTeamId");

  const getCredits = async () => {
    try {
      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(`${process.env.API_URL}/user/credits`, {
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
      console.log(error);
      return null;
    }
  };

  const credits = await getCredits();

  if (!credits) {
    redirect("/server-not-found");
  }

  if (!credits?.success) {
    return <ErrorDialog error={credits?.message} />;
  }

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant="outline"
            className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm [&_svg:not([class*='size-'])]:size-3"
          >
            <CircleDot />
            {credits?.credits}
          </Button>
        }
      ></MenuTrigger>

      <MenuPopup
        sideOffset={10}
        className="w-60 border border-foreground/30 rounded-lg"
      >
        <MenuGroup>
          <MenuGroupLabel>Credit Balance</MenuGroupLabel>

          <MenuItem disabled className="data-disabled:opacity-100 capitalize">
            Total Credit
            <span className="ms-auto">{credits?.credits}</span>
          </MenuItem>

          <MenuItem disabled className="data-disabled:opacity-100 capitalize">
            Plan
            <span className="ms-auto">{credits?.plan}</span>
          </MenuItem>

          <MenuSeparator className="bg-foreground/10" />

          <BuyCreditDialog teamId={teamId} />

          <Link href={"/billing"}>
            <MenuItem className="text-foreground data-highlighted:bg-foreground/5 data-highlighted:text-foreground cursor-pointer px-2.5!">
              <ExternalLink />
              {credits?.plan === "enterprise" ? "Billing" : "Upgrade Plan"}
            </MenuItem>
          </Link>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
};

export default CreditMenu;
