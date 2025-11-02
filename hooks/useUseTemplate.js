"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function useUseTemplate(setIsOpen) {
  const [isUsingTemplate, setIsUsingTemplate] = useState(false);

  const handleUseTemplate = async (teamId, templateId) => {
    try {
      setIsUsingTemplate(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/template/duplicate/${teamId}/${templateId}`,
        {}
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsOpen(false);

      toast.success("Template duplicated successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsUsingTemplate(false);
    }
  };

  return {
    isUsingTemplate,
    handleUseTemplate,
  };
}
