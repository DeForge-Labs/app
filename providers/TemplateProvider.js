"use client";

import StartContainer from "@/components/ui/StartContainer";
import useInitialize from "@/hooks/useInitialize";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import useLibrary from "@/hooks/useLibrary";

export default function TemplateProvider({ children, params }) {
  const isTeamsInitializing = useSelector(
    (state) => state.template.isTeamsInitializing
  );
  const { loadUserAndTeams, loadTemplate } = useInitialize();
  const { loadNodeRegistry } = useLibrary();

  useEffect(() => {
    loadUserAndTeams();
  }, []);

  useEffect(() => {
    loadNodeRegistry();
  }, []);

  useEffect(() => {
    if (!params?.value) return;

    try {
      const parsedValue = JSON.parse(params.value);
      const id = parsedValue.id;
      if (!id) return;

      loadTemplate(id);
    } catch (error) {
      console.error("Error parsing params value:", error);
    }
  }, [params]);

  if (isTeamsInitializing) {
    return (
      <StartContainer>
        <Loader2 className="w-8 h-8 animate-spin opacity-50" />
      </StartContainer>
    );
  }

  return <div>{children}</div>;
}
