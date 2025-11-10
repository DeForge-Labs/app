"use client";

import axios from "axios";
import { toast } from "sonner";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function useEnv() {
  const { setWorkflowEnv } = useWorkspaceStore();

  const getEnv = async (workflowId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/getEnv/${workflowId}`,
        {}
      );

      setWorkflowEnv(response.data.env);

      return response.data.env;
    } catch (err) {
      console.log(err);
      toast.error("Failed to load environment variables");
      return null;
    }
  };

  return {
    getEnv,
  };
}
