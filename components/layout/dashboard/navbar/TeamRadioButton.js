"use client";

import Link from "next/link";
import { MenuRadioItem } from "@/components/ui/menu";
import { updateLastTeamIdCookie } from "@/actions/updateTeamId";

export default function TeamRadioButton({ team }) {
  return (
    <Link href={`/dashboard/${team?.teamId}`}>
      <MenuRadioItem
        value={team?.teamId}
        className="cursor-pointer data-highlighted:bg-foreground/5"
        onClick={() => {
          updateLastTeamIdCookie(team?.teamId);
        }}
      >
        <p className="text-xs">{team?.team?.name}</p>
        <p className="text-[10px] text-foreground/60 capitalize">
          {team?.role?.toLowerCase()}
        </p>
      </MenuRadioItem>
    </Link>
  );
}
