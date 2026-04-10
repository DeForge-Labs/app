"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Globe, File, LayoutGrid, Home } from "lucide-react";

const idToMap = {
  Home: <Home />,
  LayoutGrid: <LayoutGrid />,
  Globe: <Globe />,
  Users: <Users />,
  File: <File />,
};

const SIDEBAR_BUTTON_CLASSES =
  "flex gap-2 bg-transparent font-normal w-full shadow-none [:hover,[data-pressed]]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60";

export default function NavLink({ href, icon: Icon, label }) {
  const pathname = usePathname();
  return (
    <Link href={href} className="w-full">
      <Button
        variant="outline"
        className={cn(
          SIDEBAR_BUTTON_CLASSES,
          pathname === href ? "!bg-foreground/5" : "",
        )}
      >
        {idToMap[Icon]}
        {label}
      </Button>
    </Link>
  );
}
