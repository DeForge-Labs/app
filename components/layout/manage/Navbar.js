"use client";

import { ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import DashboardButton from "./DashboardButton";
import ThemeChanger from "../dashboard/ThemeChanger";

export default function Navbar() {
  const isTeamInitializing = useSelector(
    (state) => state.team.isTeamInitializing
  );
  const team = useSelector((state) => state.team.team);
  return (
    <header className="sticky top-0 z-10 border-b border-black/50 bg-background dark:bg-dark dark:border-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo/logo-black.svg"
            alt="Logo"
            width={22}
            height={22}
            className="dark:invert"
          />
          <span className="font-bold inline-block text-2xl dark:text-background">
            Deforge
          </span>
          <ChevronRight size={16} className="mt-1 dark:text-background" />
          <span className="text-sm mt-0.5 flex items-center gap-1 dark:text-background">
            {isTeamInitializing ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <>
                <p>{team?.name}</p>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeChanger />
          <DashboardButton />
        </div>
      </div>
    </header>
  );
}
