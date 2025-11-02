import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { CircleDot, ExternalLink } from "lucide-react";
import { HandCoins } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import BuyCreditDialog from "./BuyCreditDialog";

export default async function CreditMenu({ params }) {
  const { id } = await params;

  const getCredits = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

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
    redirect("/");
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
        className="w-[250px] border border-foreground/30 rounded-lg"
        sideOffset={10}
      >
        <MenuGroup>
          <MenuGroupLabel>Credit Balance</MenuGroupLabel>
          <MenuItem disabled className="data-disabled:opacity-100">
            Total Credit
            <div className="ms-auto">{credits?.credits}</div>
          </MenuItem>
          <MenuItem disabled className="data-disabled:opacity-100">
            Plan
            <div className="ms-auto capitalize">{credits?.plan}</div>
          </MenuItem>

          <MenuSeparator className="bg-foreground/10" />

          <BuyCreditDialog teamId={id} />
          <Link href={"/dashboard/" + id + "/billing"}>
            <MenuItem className="text-foreground data-highlighted:bg-foreground/5 data-highlighted:text-foreground cursor-pointer !px-[10px]">
              <ExternalLink />
              {credits?.plan === "enterprise" ? "Billing" : "Upgrade Plan"}
            </MenuItem>
          </Link>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
}
