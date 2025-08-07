"use client";

import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useInitialize from "./useInitialize";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function useWorkflow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const team = useSelector((state) => state.team.team);
  const { loadWorkflow } = useInitialize();
  const router = useRouter();

  const handleCreateWorkflow = async (templateId, type = "editor") => {
    try {
      setIsCreatingWorkflow(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/create`,
        { name: workflowName, teamId: team?.id, templateId },
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      loadWorkflow(team?.id);
      router.push(`/${type}/${response.data.workspace.id}`);
      setIsOpen(false);
      setWorkflowName("");

      toast.success("Workspace created successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsCreatingWorkflow(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isCreatingWorkflow,
    setIsCreatingWorkflow,
    workflowName,
    setWorkflowName,
    handleCreateWorkflow,
  };
}
