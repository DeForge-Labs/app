"use client";

import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function useCloneTemplate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCloningTemplate, setIsCloningTemplate] = useState(false);
  const template = useSelector((state) => state.template.template);
  const router = useRouter();

  const handleCloneTemplate = async (teamid) => {
    try {
      setIsCloningTemplate(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/template/duplicate/${teamid}/${template?.id}`,
        {},
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsOpen(false);
      router.push(`/form/${response.data.workspace.id}`);

      toast.success("Template cloned successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsCloningTemplate(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isCloningTemplate,
    setIsCloningTemplate,
    handleCloneTemplate,
  };
}
