"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function useWorkflow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const router = useRouter();

  const handleCreateWorkflow = async (name, templateId = "blank") => {
    try {
      setIsCreatingWorkflow(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/create`,
        { name, templateId }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      router.push(`/editor/${response.data.workspace.id}`);
      setIsOpen(false);

      toast.success("Workspace created successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsCreatingWorkflow(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isCreatingWorkflow,
    setIsCreatingWorkflow,
    handleCreateWorkflow,
  };
}
