"use client";

import { useState } from "react";
import useInitialize from "./useInitialize";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function useDeleteWorkflow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeletingWorkflow, setIsDeletingWorkflow] = useState(false);
  const { loadWorkflow } = useInitialize();
  const team = useSelector((state) => state.team.team);

  const handleDeleteWorkflow = async (workflowId) => {
    try {
      setIsDeletingWorkflow(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/delete/${workflowId}`,
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      loadWorkflow(team?.id);
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
    isOpen,
    setIsOpen,
    isDeletingWorkflow,
    setIsDeletingWorkflow,
    handleDeleteWorkflow,
  };
}
