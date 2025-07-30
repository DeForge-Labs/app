"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function usePublishTemplate() {
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isPublishingTemplate, setIsPublishingTemplate] = useState(false);
  const router = useRouter();

  const handlePublishTemplate = async (
    name,
    description,
    category,
    tags,
    selectedIcon,
    visibility,
    author,
    workspaceId,
    teamId
  ) => {
    try {
      setIsPublishingTemplate(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/template/publish/${workspaceId}`,
        { name, description, category, tags, selectedIcon, visibility, author },
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsTemplateOpen(false);

      toast.success("Template published successfully");

      router.push(`/dashboard/${teamId}`);

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
    isTemplateOpen,
    setIsTemplateOpen,
    isPublishingTemplate,
    setIsPublishingTemplate,
    handlePublishTemplate,
  };
}
