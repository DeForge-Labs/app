import Link from "next/link";
import { Settings, ExternalLink } from "lucide-react";

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

import LogoutDialog from "./LogoutDialog";
import ThemeRadioButtons from "./ThemeRadioButtons";

export default async function SettingsMenu() {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant="outline"
            className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
          />
        }
      >
        <Settings />
        Settings
      </MenuTrigger>

      <MenuPopup
        align="end"
        sideOffset={10}
        className="w-48 border border-foreground/30 rounded-lg"
      >
        <MenuGroup>
          <MenuGroupLabel>Quick Actions</MenuGroupLabel>

          <Link href="/billing">
            <MenuItem className="cursor-pointer">
              Billing <ExternalLink className="ms-auto" />
            </MenuItem>
          </Link>

          <Link href="https://docs.deforge.io" target="_blank">
            <MenuItem className="cursor-pointer">
              Documentation <ExternalLink className="ms-auto" />
            </MenuItem>
          </Link>

          <Link href="https://forum.deforge.io" target="_blank">
            <MenuItem className="cursor-pointer">
              Community Forum <ExternalLink className="ms-auto" />
            </MenuItem>
          </Link>
        </MenuGroup>

        <MenuSeparator className="bg-foreground/10" />

        <MenuGroup>
          <MenuGroupLabel>Theme</MenuGroupLabel>
          <ThemeRadioButtons />
        </MenuGroup>

        <MenuSeparator className="bg-foreground/10" />

        <LogoutDialog />
      </MenuPopup>
    </Menu>
  );
}
