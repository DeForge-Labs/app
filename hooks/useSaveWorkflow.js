"use client";

import { useState } from "react";
import useInitialize from "./useInitialize";
import axios from "axios";
import { toast } from "sonner";
import useWorkflowStore from "@/store/useWorkspaceStore";
import useFormStore from "@/store/useFormStore";

export default function useSaveWorkflow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSavingWorkflow, setIsSavingWorkflow] = useState(false);
  const { loadWorkflowById, loadFormById } = useInitialize();
  const {
    nodes,
    connections,
    hasUnsavedChanges: hasUnsavedChanges,
    form,
    workflow,
  } = useWorkflowStore();
  const { hasUnsavedChanges: hasUnsavedChangesForm, components } =
    useFormStore();

  const handleSaveWorkflow = async () => {
    try {
      setIsSavingWorkflow(true);

      if (!(hasUnsavedChangesForm || hasUnsavedChanges)) {
        toast.info("No unsaved changes to save");
        return;
      }

      axios.defaults.withCredentials = true;

      if (hasUnsavedChanges) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/workflow/save/${workflow?.id}`,
          { nodes, edges: connections }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        await loadWorkflowById(workflow?.id);
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
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        await loadFormById(form?.id);
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
