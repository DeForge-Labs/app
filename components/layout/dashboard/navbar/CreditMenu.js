import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CircleDot, ExternalLink, HandCoins } from "lucide-react";

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
      />

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

          <Link href="/billing">
            <Button
              variant="outline"
              className="text-info data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none  dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent shadow-none! bg-transparent hover:bg-transparent w-full justify-start border-none"
            >
              <HandCoins size={16} aria-hidden="true" />
              Buy Credits
            </Button>
          </Link>

          <Link href="/billing">
            <MenuItem className="text-foreground data-highlighted:bg-foreground/5 data-highlighted:text-foreground cursor-pointer px-2.5!">
              <ExternalLink />
              {credits?.plan === "pro" ? "Billing" : "Upgrade Plan"}
            </MenuItem>
          </Link>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
};

export default CreditMenu;
