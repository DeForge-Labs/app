"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import useWorkflowStore from "@/store/useWorkspaceStore";
import { useRouter } from "next/navigation";

export default function useDeployWorkflow() {
  const [isDeploying, setIsDeploying] = useState(false);
  const { workflow, workspace } = useWorkflowStore();
  const router = useRouter();

  const handleDeployWorkflow = async (view, setIsOpen) => {
    try {
      setIsDeploying(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/deploy/${workflow?.id}`,
        {
          view,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      router.push(`/viewer/${workspace?.id}`);

      setIsOpen(false);

      toast.success("Workflow deployed successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    isDeploying,
    setIsDeploying,
    handleDeployWorkflow,
  };
}
