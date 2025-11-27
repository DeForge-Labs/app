"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import useWorkflowStore from "@/store/useWorkspaceStore";
import useFormStore from "@/store/useFormStore";

export default function useSaveWorkflow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSavingWorkflow, setIsSavingWorkflow] = useState(false);

  const {
    nodes,
    connections,
    hasUnsavedChanges: hasUnsavedChanges,
    form,
    setForm,
    workflow,
    setWorkflow,
  } = useWorkflowStore();
  const {
    hasUnsavedChanges: hasUnsavedChangesForm,
    components,
    loadComponents,
  } = useFormStore();

  const handleSaveWorkflow = async () => {
    try {
      setIsSavingWorkflow(true);

      if (!(hasUnsavedChangesForm || hasUnsavedChanges)) {
        toast.info("No unsaved changes to save");
        return;
      }

      axios.defaults.withCredentials = true;

      if (hasUnsavedChanges) {
        const url =
          workflow?.status === "LIVE"
            ? `${process.env.NEXT_PUBLIC_API_URL}/workflow/live/save/${workflow?.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/workflow/save/${workflow?.id}`;

        const response = await axios.post(url, {
          nodes,
          edges: workflow.status === "LIVE" ? null : connections,
        });

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        setWorkflow({
          workflow: response.data.workflow,
          nodes: response.data.workflow.nodes,
          connections: response.data.workflow.edges,
        });
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

        setForm(response.data.form);

        loadComponents(response.data.form.formLayout?.components || []);
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
