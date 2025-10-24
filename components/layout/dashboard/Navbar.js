"use client";

import {
  ChevronsUpDown,
  CircleDot,
  ExternalLink,
  HandCoins,
  Loader2,
  LogOut,
  Moon,
  Plus,
  Settings,
  Sun,
} from "lucide-react";
import { useSelector } from "react-redux";
import ThemeChanger from "./ThemeChanger";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import CreateWorkflowButton from "./CreateWorkflowButton";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const router = useRouter();
  const isTeamInitializing = useSelector(
    (state) => state.team.isTeamInitializing
  );
  const team = useSelector((state) => state.team.team);
  return (
    <header className="sticky top-0 z-50 bg-foreground/5">
      <div className="flex items-center justify-between px-2 h-[50px]">
        <div className="flex items-center gap-4 h-full">
          <Link
            href="/"
            className="flex items-center ml-1 justify-center space-x-2"
          >
            <div className="p-1.5 bg-black/80 w-fit rounded-sm shadow-md shadow-[#8754ff]">
              <Image
                src="/logo/logo-white.svg"
                alt="Deforge"
                width={16}
                height={16}
              />
            </div>
          </Link>

          <Separator
            orientation="vertical"
            className={"bg-foreground/10 h-[20px]"}
          />

          <span className="flex items-center gap-1 dark:text-background">
            {isTeamInitializing ? (
              <Loader2 className="animate-spin w-3 h-3" />
            ) : (
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
                    <p className="text-sm text-foreground">{team?.name}</p>
                    <Badge
                      variant="outline"
                      className="text-[10px] p-1 px-2 bg-foreground/5 border border-foreground/5 text-foreground/70"
                    >
                      Free
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
                    <MenuRadioGroup>
                      <MenuRadioItem
                        value="1"
                        className="cursor-pointer data-highlighted:bg-foreground/5"
                      >
                        <p>Team 1</p>
                        <p className="text-[10px] text-foreground/60">Admin</p>
                      </MenuRadioItem>
                      <MenuRadioItem
                        value="2"
                        className="cursor-pointer data-highlighted:bg-foreground/5"
                      >
                        <p>Team 2</p>
                        <p className="text-[10px] text-foreground/60">Admin</p>
                      </MenuRadioItem>
                      <MenuRadioItem
                        value="3"
                        className="cursor-pointer data-highlighted:bg-foreground/5"
                      >
                        <p>Team 3</p>
                        <p className="text-[10px] text-foreground/60">Admin</p>
                      </MenuRadioItem>
                    </MenuRadioGroup>
                    <MenuSeparator className="bg-foreground/10" />
                    <MenuItem className="text-info data-highlighted:bg-foreground/5 data-highlighted:text-info cursor-pointer">
                      <Plus size={16} />
                      Create / Join
                    </MenuItem>
                  </MenuPopup>
                </Menu>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeChanger />
          <Button
            variant="outline"
            className="text-xs bg-background font-normal border border-foreground/20 rounded-sm"
            onClick={() => {}}
          >
            Feedback
          </Button>

          <Menu>
            <MenuTrigger
              render={
                <Button
                  variant="outline"
                  className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm [&_svg:not([class*='size-'])]:size-3"
                  onClick={() => {}}
                >
                  <CircleDot />
                  42
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
                  <div className="ms-auto">42</div>
                </MenuItem>
                <MenuItem disabled className="data-disabled:opacity-100">
                  Monthly Credit
                  <div className="ms-auto">42</div>
                </MenuItem>
                <MenuItem disabled className="data-disabled:opacity-100">
                  Purchase Credit
                  <div className="ms-auto">42</div>
                </MenuItem>

                <MenuSeparator className="bg-foreground/10" />

                <MenuItem className="text-info data-highlighted:bg-foreground/5 data-highlighted:text-info cursor-pointer">
                  <HandCoins />
                  Buy Credit
                </MenuItem>
              </MenuGroup>
            </MenuPopup>
          </Menu>

          <Menu>
            <MenuTrigger
              render={
                <Button
                  variant="outline"
                  className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
                  onClick={() => {}}
                >
                  <Settings />
                  Settings
                </Button>
              }
            ></MenuTrigger>
            <MenuPopup
              className="w-[200px] border border-foreground/30 rounded-lg"
              align="end"
              sideOffset={10}
            >
              <MenuGroup>
                <MenuGroupLabel>Quick Actions</MenuGroupLabel>
                <MenuItem className="cursor-pointer">
                  Billing <ExternalLink className="ms-auto" />
                </MenuItem>
                <MenuItem className="cursor-pointer">
                  Documentation <ExternalLink className="ms-auto" />
                </MenuItem>
                <MenuItem className="cursor-pointer">
                  Community Forum <ExternalLink className="ms-auto" />
                </MenuItem>
              </MenuGroup>
              <MenuSeparator className="bg-foreground/10" />

              <MenuGroup>
                <MenuGroupLabel>Theme</MenuGroupLabel>
                <MenuRadioGroup>
                  <MenuRadioItem value="1">Dark</MenuRadioItem>
                  <MenuRadioItem value="2">Light</MenuRadioItem>
                </MenuRadioGroup>
              </MenuGroup>
              <MenuSeparator className="bg-foreground/10" />
              <MenuItem className="text-destructive data-highlighted:bg-foreground/5 data-highlighted:text-destructive cursor-pointer">
                <LogOut size={16} />
                Logout
              </MenuItem>
            </MenuPopup>
          </Menu>
        </div>
      </div>
    </header>
  );
}
