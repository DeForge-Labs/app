"use client";

import StartContainer from "@/components/ui/StartContainer";
import useInitialize from "@/hooks/useInitialize";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function UserTeamsProvider({ children }) {
  const isTeamsInitializing = useSelector(
    (state) => state.template.isTeamsInitializing
  );
  const { loadUserAndTeams } = useInitialize();

  useEffect(() => {
    loadUserAndTeams();
  }, []);

  if (isTeamsInitializing) {
    return (
      <StartContainer>
        <Loader2 className="w-8 h-8 animate-spin opacity-50 dark:text-background" />
      </StartContainer>
    );
  }

  return <div>{children}</div>;
}
