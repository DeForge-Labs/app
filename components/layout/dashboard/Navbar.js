"use client";

import { Button } from "@heroui/react";
import { ChevronRight, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import CreateWorkflowButton from "./CreateWorkflowButton";

export default function Navbar() {
  const isTeamInitializing = useSelector(
    (state) => state.team.isTeamInitializing
  );
  const team = useSelector((state) => state.team.team);
  return (
    <header className="sticky top-0 z-10 border-b border-black/50 bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Image src="/logo/logo-black.svg" alt="Logo" width={22} height={22} />
          <span className="font-bold inline-block text-2xl">Deforge</span>
          <ChevronRight size={16} className="mt-1" />
          <span className="inline-block text-sm mt-0.5">
            {isTeamInitializing ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              team?.name
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CreateWorkflowButton />
        </div>
      </div>
    </header>
  );
}
