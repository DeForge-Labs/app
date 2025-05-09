"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import useInitialize from "@/hooks/useInitialize";
import useLibrary from "@/hooks/useLibrary";

export default function WorkflowProvider({ children, params }) {
  const user = useSelector((state) => state.user.user);
  const nodeRegistry = useSelector((state) => state.library.nodeRegistry);
  const { loadWorkflowById } = useInitialize();
  const { loadNodeRegistry } = useLibrary();

  useEffect(() => {
    loadNodeRegistry();
  }, []);

  useEffect(() => {
    if (user && nodeRegistry && nodeRegistry.length > 0) {
      if (!params?.value) return;

      const parsedValue = JSON.parse(params.value);
      const id = parsedValue.id;

      if (!id) return;

      loadWorkflowById(id);
    }
  }, [user, params, nodeRegistry]);

  return <>{children}</>;
}
