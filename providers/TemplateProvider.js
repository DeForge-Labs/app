"use client";

import useInitialize from "@/hooks/useInitialize";
import { useEffect } from "react";
import useLibrary from "@/hooks/useLibrary";
import { useParams } from "next/navigation";

export default function TemplateProvider({ children }) {
  const { loadTemplate } = useInitialize();
  const { loadNodeRegistry } = useLibrary();
  const params = useParams();

  useEffect(() => {
    loadNodeRegistry();
  }, []);

  useEffect(() => {
    if (!params?.id) return;

    try {
      const id = params.id;
      if (!id) return;

      loadTemplate(id);
    } catch (error) {
      console.error("Error parsing params value:", error);
    }
  }, [params?.id]);

  return <div>{children}</div>;
}
