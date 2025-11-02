"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function useRevertTemplate(setIsOpen) {
  const [isRevertingTemplate, setIsRevertingTemplate] = useState(false);
  const router = useRouter();

  const handleRevertTemplate = async (templateId) => {
    try {
      setIsRevertingTemplate(true);

      axios.defaults.withCredentials = true;

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/template/revert/${templateId}`,
        {}
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      router.refresh();

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
    isRevertingTemplate,
    handleRevertTemplate,
  };
}
