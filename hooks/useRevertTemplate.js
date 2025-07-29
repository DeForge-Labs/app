"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useInitialize from "./useInitialize";

export default function useRevertTemplate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevertingTemplate, setIsRevertingTemplate] = useState(false);
  const team = useSelector((state) => state.team.team);
  const { loadWorkflow } = useInitialize();

  const handleRevertTemplate = async (templateId) => {
    try {
      setIsRevertingTemplate(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/template/revert/${templateId}`,
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      await loadWorkflow(team?.id);

      setIsOpen(false);

      toast.success("Template reverted successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsRevertingTemplate(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isRevertingTemplate,
    setIsRevertingTemplate,
    handleRevertTemplate,
  };
}
