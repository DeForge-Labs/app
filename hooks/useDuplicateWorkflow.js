"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import useInitialize from "./useInitialize";
import { toast } from "sonner";
import axios from "axios";

export const useDuplicateWorkflow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDuplicatingWorkflow, setIsDuplicatingWorkflow] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const team = useSelector((state) => state.team.team);
  const { loadWorkflow } = useInitialize();

  const handleDuplicateWorkflow = async (workflow) => {
    try {
      setIsDuplicatingWorkflow(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/duplicate/${workflow.id}`,
        { name: workflowName ? workflowName : workflow.name + " (Copy)" },
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      loadWorkflow(team?.id);
      setIsOpen(false);
      setWorkflowName("");

      toast.success("Workflow duplicated successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsDuplicatingWorkflow(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isDuplicatingWorkflow,
    setIsDuplicatingWorkflow,
    workflowName,
    setWorkflowName,
    handleDuplicateWorkflow,
  };
};
