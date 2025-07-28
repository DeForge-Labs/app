"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function usePublishForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublishingForm, setIsPublishingForm] = useState(false);
  const router = useRouter();

  const handlePublishForm = async (workspaceId, type) => {
    try {
      setIsPublishingForm(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/publish/${workspaceId}`,
        { type },
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsOpen(false);

      toast.success(
        type === "WORKFLOW"
          ? "Form Switched to Editor Mode"
          : "Form published successfully"
      );

      if (type === "WORKFLOW") {
        router.push(`/editor/${workspaceId}`);
      } else {
        router.push(`/form/${workspaceId}`);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsPublishingForm(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isPublishingForm,
    setIsPublishingForm,
    handlePublishForm,
  };
}
