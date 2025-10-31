"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useDeleteWorkflow(setIsOpen) {
  const [isDeletingWorkflow, setIsDeletingWorkflow] = useState(false);
  const router = useRouter();

  const handleDeleteWorkflow = async (workflowId) => {
    try {
      setIsDeletingWorkflow(true);

      axios.defaults.withCredentials = true;

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/delete/${workflowId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      router.refresh();
      setIsOpen(false);

      toast.success("Workflow deleted successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsDeletingWorkflow(false);
    }
  };

  return {
    isDeletingWorkflow,
    setIsDeletingWorkflow,
    handleDeleteWorkflow,
  };
}
