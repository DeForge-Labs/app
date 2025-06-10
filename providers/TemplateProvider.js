"use client";

import useInitialize from "@/hooks/useInitialize";
import { useEffect } from "react";
import useLibrary from "@/hooks/useLibrary";

export default function TemplateProvider({ children, params }) {
  const { loadTemplate } = useInitialize();
  const { loadNodeRegistry } = useLibrary();

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

  return <div>{children}</div>;
}
