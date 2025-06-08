"use client";

import useInitialize from "@/hooks/useInitialize";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ManageProvider({ children, params }) {
  const user = useSelector((state) => state.user.user);
  const { loadTeam, loadMembers } = useInitialize();
  const team = useSelector((state) => state.team.team);
  useEffect(() => {
    if (user && !team?.id) {
      if (!params?.value) return;

      const parsedValue = JSON.parse(params.value);
      const id = parsedValue.id;

      if (!id) return;

      loadTeam(id);
    }
  }, [user, team?.id]);

  useEffect(() => {
    if (team?.id) {
      loadMembers(team.id);
    }
  }, [team]);

  return <>{children}</>;
}
