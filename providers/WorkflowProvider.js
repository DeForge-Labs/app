"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import useInitialize from "@/hooks/useInitialize";

export default function WorkflowProvider({ children, params }) {
  const user = useSelector((state) => state.user.user);
  const { loadWorkflowById } = useInitialize();
  useEffect(() => {
    if (user) {
      if (!params?.value) return;

      const parsedValue = JSON.parse(params.value);
      const id = parsedValue.id;

      if (!id) return;

      loadWorkflowById(id);
    }
  }, [user, params]);

  return <>{children}</>;
}
