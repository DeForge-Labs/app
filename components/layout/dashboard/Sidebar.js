"use client";

import { Button } from "@heroui/react";
import {
  Activity,
  Grid2X2,
  Headset,
  Layers,
  LayoutTemplate,
  StickyNote,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import LogoutButton from "./LogoutButton";
import { setTab } from "@/redux/slice/TeamSlice";
import { cn } from "@/lib/utils";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  return (
    <div className="lg:w-80 w-64 border-r bg-black/5 dark:bg-white/5 border-black/50 relative overflow-y-auto hide-scroll dark:border-background dark:text-background p-3 px-0 flex flex-col">
      <div className="flex items-center gap-2 p-4 pt-2 px-6 pb-0">
        <Image
          src="/logo/logo-black.svg"
          alt="Logo"
          width={24}
          height={24}
          className="dark:invert"
        />
        <span className="font-bold inline-block text-3xl dark:text-background">
          Deforge
        </span>
      </div>

      <div className="flex flex-col flex-1 justify-between px-4 pt-2">
        <div className="flex flex-col mt-3">
          <Button
            size="md"
            className={cn(
              "text-md transition-colors bg-transparent text-black dark:text-background justify-start",
              pathname === `/dashboard/${params.id}`
                ? "bg-black/80 text-background dark:bg-background dark:text-black"
                : "hover:bg-black/5 hover:dark:bg-white/5"
            )}
            onPress={() => {
              if (pathname === `/dashboard/${params.id}`) return;
              router.push(`/dashboard/${params.id}`);
            }}
          >
            <Grid2X2 size={20} />
            Dashboard
          </Button>

          <Button
            size="md"
            className={cn(
              "text-md transition-colors bg-transparent text-black dark:text-background justify-start",
              pathname === `/workspaces/${params.id}`
                ? "bg-black/80 text-background dark:bg-background dark:text-black"
                : "hover:bg-black/5 hover:dark:bg-white/5"
            )}
            onPress={() => {
              if (pathname === `/workspaces/${params.id}`) return;
              router.push(`/workspaces/${params.id}`);
            }}
          >
            <Zap size={20} />
            Workspaces
          </Button>

          <Button
            size="md"
            className={cn(
              "text-md transition-colors bg-transparent text-black dark:text-background justify-start",
              pathname === `/templates/${params.id}`
                ? "bg-black/80 text-background dark:bg-background dark:text-black"
                : "hover:bg-black/5 hover:dark:bg-white/5"
            )}
            onPress={() => {
              if (pathname === `/templates/${params.id}`) return;
              router.push(`/templates/${params.id}`);
            }}
          >
            <Layers size={20} />
            Templates
          </Button>

          <Button
            size="md"
            className={cn(
              "text-md transition-colors bg-transparent text-black dark:text-background justify-start",
              pathname === `/published/${params.id}`
                ? "bg-black/80 text-background dark:bg-background dark:text-black"
                : "hover:bg-black/5 hover:dark:bg-white/5"
            )}
            onPress={() => {
              if (pathname === `/published/${params.id}`) return;
              router.push(`/published/${params.id}`);
            }}
          >
            <LayoutTemplate size={20} />
            Published
          </Button>

          <Button
            size="md"
            className={cn(
              "text-md transition-colors bg-transparent text-black dark:text-background justify-start",
              pathname === `/usage/${params.id}`
                ? "bg-black/80 text-background dark:bg-background dark:text-black"
                : "hover:bg-black/5 hover:dark:bg-white/5"
            )}
            onPress={() => {
              if (pathname === `/usage/${params.id}`) return;
              router.push(`/usage/${params.id}`);
            }}
          >
            <Activity size={20} />
            Usage
          </Button>

          <Button
            size="md"
            className={cn(
              "text-md transition-colors bg-transparent text-black dark:text-background justify-start",
              pathname === `/manage/${params.id}`
                ? "bg-black/80 text-background dark:bg-background dark:text-black"
                : "hover:bg-black/5 hover:dark:bg-white/5"
            )}
            onPress={() => {
              if (pathname === `/manage/${params.id}`) return;
              router.push(`/manage/${params.id}`);
            }}
          >
            <Users size={20} />
            Team
          </Button>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-4">
          <div
            className="flex gap-1 items-center hover:cursor-pointer hover:text-black/80 dark:hover:text-background"
            onClick={() => window.open("https://docs.deforge.io", "_blank")}
          >
            <StickyNote className="w-4 h-4" />
            <p className="text-sm">Docs</p>
          </div>
          <div
            className="flex gap-1 items-center hover:cursor-pointer hover:text-black/80 dark:hover:text-background dark:text-background pb-2"
            onClick={() =>
              window.open("https://cal.com/anoy-deforge/30min", "_blank")
            }
          >
            <Headset className="w-4 h-4" />
            <p className="text-sm">Contact Us</p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
