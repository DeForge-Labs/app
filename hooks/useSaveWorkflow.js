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
  const { loadWorkflowById, loadFormById } = useInitialize();
  const workflow = useSelector((state) => state.workflow.workflow);
  const form = useSelector((state) => state.workflow.form);
  const hasUnsavedChanges = useSelector(
    (state) => state.workflow.hasUnsavedChanges
  );
  const hasUnsavedChangesForm = useSelector(
    (state) => state.form.hasUnsavedChanges
  );
  const components = useSelector((state) => state.form.components);
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.workflow.nodes);
  const connections = useSelector((state) => state.workflow.connections);

  const handleSaveWorkflow = async () => {
    try {
      setIsSavingWorkflow(true);

      if (!(hasUnsavedChangesForm || hasUnsavedChanges)) {
        toast.info("No unsaved changes to save");
        return;
      }

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      if (hasUnsavedChanges) {
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
      }

      if (hasUnsavedChangesForm) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/form/save/${form?.id}`,
          {
            formLayout: {
              components,
              lastSaved: new Date().toISOString(),
            },
          },
          { headers }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        loadFormById(form?.id);
        setIsOpen(false);

        toast.success(response.data.message);
      }
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
