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
  const { loadUserAndTeams, loadTemplates } = useInitialize();

  useEffect(() => {
    loadUserAndTeams();
  }, []);

  useEffect(() => {
    loadTemplates();
  }, []);

  if (isTeamsInitializing) {
    return (
      <StartContainer>
        <Loader2 className="w-8 h-8 animate-spin opacity-50 dark:text-background" />
      </StartContainer>
    );
  }

  return (
    <div className="flex flex-col min-h-screen dark:bg-dark">{children}</div>
  );
}
