"use client";

import useInitialize from "@/hooks/useInitialize";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function TeamProvider({ children, params }) {
  const user = useSelector((state) => state.user.user);
  const { loadTeam } = useInitialize();
  useEffect(() => {
    if (user) {
      if (!params?.value) return;

      const parsedValue = JSON.parse(params.value);
      const id = parsedValue.id;

      if (!id) return;

      loadTeam(id);
    }
  }, [user, params]);
  return <>{children}</>;
}
