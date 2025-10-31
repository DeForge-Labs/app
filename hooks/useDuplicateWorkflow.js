"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function useDuplicateWorkflow(setIsOpen) {
  const [isDuplicatingWorkflow, setIsDuplicatingWorkflow] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const router = useRouter();

  const handleDuplicateWorkflow = async (appId, appName) => {
    try {
      setIsDuplicatingWorkflow(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/duplicate/${appId}`,
        { name: workflowName ? workflowName : appName + " (Copy)" }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsOpen(false);

      router.refresh();

      setWorkflowName("");

      toast.success("App duplicated successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsDuplicatingWorkflow(false);
    }
  };

  return {
    isDuplicatingWorkflow,
    setIsDuplicatingWorkflow,
    workflowName,
    setWorkflowName,
    handleDuplicateWorkflow,
  };
}
