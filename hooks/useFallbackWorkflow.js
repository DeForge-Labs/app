"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import useWorkflowStore from "@/store/useWorkspaceStore";
import { useRouter } from "next/navigation";

export default function useFallbackWorkflow() {
  const { workflow, workspace } = useWorkflowStore();
  const [isFallbacking, setIsFallbacking] = useState(false);
  const router = useRouter();

  const handleFallbackWorkflow = async (setIsOpen) => {
    try {
      setIsFallbacking(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/fallback/${workflow?.id}`,
        {}
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsOpen(false);
      router.push(`/editor/${workspace?.id}`);

      toast.success("Workflow rolled back successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsFallbacking(false);
    }
  };

  return {
    isFallbacking,
    setIsFallbacking,
    handleFallbackWorkflow,
  };
}
