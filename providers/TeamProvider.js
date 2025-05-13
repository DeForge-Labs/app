"use client";

import useInitialize from "@/hooks/useInitialize";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function TeamProvider({ children, params }) {
  const user = useSelector((state) => state.user.user);
  const { loadTeam, loadWorkflow } = useInitialize();
  const team = useSelector((state) => state.team.team);
  useEffect(() => {
    if (user) {
      if (!params?.value) return;

      const parsedValue = JSON.parse(params.value);
      const id = parsedValue.id;

      if (!id) return;

      loadTeam(id);
    }
  }, [user]);

  useEffect(() => {
    if (team?.id) {
      loadWorkflow(team.id);
    }
  }, [team]);

  return <>{children}</>;
}
