"use client";

import { useRouter } from "next/navigation";

import { MenuRadioItem } from "@/components/ui/menu";

import { updateLastTeamIdCookie } from "@/actions/updateTeamId";

const TeamRadioButton = ({ team }) => {
  const router = useRouter();

  const updateTeamId = async () => {
    await updateLastTeamIdCookie(team?.teamId);
    router.push("/dashboard");
  };

  return (
    <MenuRadioItem
      value={team?.teamId}
      onClick={updateTeamId}
      className="cursor-pointer data-highlighted:bg-foreground/5"
    >
      <p className="text-xs">{team?.team?.name}</p>

      <p className="text-[10px] text-foreground/60 capitalize">
        {team?.role?.toLowerCase()}
      </p>
    </MenuRadioItem>
  );
};

export default TeamRadioButton;
