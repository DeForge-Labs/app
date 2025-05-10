"use client";

import { useState } from "react";
import useInitialize from "./useInitialize";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";

export default function useFallbackWorkflow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFallbacking, setIsFallbacking] = useState(false);
  const { loadWorkflowById } = useInitialize();
  const workflow = useSelector((state) => state.workflow.workflow);

  const handleFallbackWorkflow = async () => {
    try {
      setIsFallbacking(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/fallback/${workflow?.id}`,
        {},
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      loadWorkflowById(workflow?.id);
      setIsOpen(false);

      toast.success("Workflow rolled back successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsFallbacking(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isFallbacking,
    setIsFallbacking,
    handleFallbackWorkflow,
  };
}
