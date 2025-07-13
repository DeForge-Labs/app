"use client";

import StartContainer from "@/components/ui/StartContainer";
import useInitialize from "@/hooks/useInitialize";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function UserProvider({ children }) {
  const isInitializing = useSelector((state) => state.user.isInitializing);
  const { loadUser } = useInitialize();

  useEffect(() => {
    loadUser();
  }, []);

  if (isInitializing) {
    return (
      <StartContainer>
        <Loader2 className="w-8 h-8 animate-spin opacity-50 dark:text-background" />
      </StartContainer>
    );
  }

  return <div>{children}</div>;
}
