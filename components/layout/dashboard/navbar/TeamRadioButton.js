"use client";

import { MenuRadioItem } from "@/components/ui/menu";
import { updateLastTeamIdCookie } from "@/actions/updateTeamId";
import { useRouter } from "next/navigation";

export default function TeamRadioButton({ team }) {
  const router = useRouter();
  return (
    <MenuRadioItem
      value={team?.teamId}
      className="cursor-pointer data-highlighted:bg-foreground/5"
      onClick={async () => {
        await updateLastTeamIdCookie(team?.teamId);
        router.push("/dashboard");
      }}
    >
      <p className="text-xs">{team?.team?.name}</p>
      <p className="text-[10px] text-foreground/60 capitalize">
        {team?.role?.toLowerCase()}
      </p>
    </MenuRadioItem>
  );
}
