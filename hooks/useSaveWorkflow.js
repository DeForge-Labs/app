"use client";

import { useState } from "react";
import useInitialize from "./useInitialize";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function useSaveWorkflow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSavingWorkflow, setIsSavingWorkflow] = useState(false);
  const { loadWorkflowById } = useInitialize();
  const workflow = useSelector((state) => state.workflow.workflow);
  const hasUnsavedChanges = useSelector(
    (state) => state.workflow.hasUnsavedChanges
  );
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.workflow.nodes);
  const connections = useSelector((state) => state.workflow.connections);

  const handleSaveWorkflow = async () => {
    try {
      setIsSavingWorkflow(true);

      if (!hasUnsavedChanges) {
        toast.info("No unsaved changes to save");
        return;
      }

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/save/${workflow?.id}`,
        { nodes, edges: connections },
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      loadWorkflowById(workflow?.id);
      setIsOpen(false);

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSavingWorkflow(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isSavingWorkflow,
    setIsSavingWorkflow,
    handleSaveWorkflow,
  };
}
