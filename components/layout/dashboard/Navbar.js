"use client";

import { ChevronRight, Loader2, Settings, Users } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const router = useRouter();
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
          <span className="text-sm mt-0.5 flex items-center gap-1">
            {isTeamInitializing ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <>
                <p>{team?.name}</p>
                <Link
                  href={`/manage/${team?.id}`}
                  className="text-black/60 text-xs hover:animate-spin mt-0.5"
                >
                  <Settings size={16} />
                </Link>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            className="border border-black/50 h-9 rounded-lg text-black/80 text-xs"
            onPress={() => {
              router.push(`/team`);
            }}
          >
            <Users size={16} />
            Teams
          </Button>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
