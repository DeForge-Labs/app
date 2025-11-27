"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import useWorkflowStore from "@/store/useWorkspaceStore";

export default function usePublishTemplate() {
  const [isPublishingTemplate, setIsPublishingTemplate] = useState(false);
  const { workspace } = useWorkflowStore();

  const handlePublishTemplate = async (
    name,
    description,
    category,
    type,
    selectedIcon,
    author,
    setIsOpen
  ) => {
    try {
      setIsPublishingTemplate(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/template/publish/${workspace?.id}`,
        {
          name,
          description,
          category,
          type,
          selectedIcon,
          visibility: "LISTED",
          author,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsOpen(false);

      toast.success("Template published successfully");

      window.open(`/template/${response.data.template.id}`, "_blank");

      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsPublishingTemplate(false);
    }
  };

  return {
    isPublishingTemplate,
    setIsPublishingTemplate,
    handlePublishTemplate,
  };
}
