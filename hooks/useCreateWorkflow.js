"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function useWorkflow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const router = useRouter();

  const handleCreateWorkflow = async (
    name,
    templateId = "blank",
    trigger = false,
    chatPrompt = false,
  ) => {
    try {
      setIsCreatingWorkflow(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/create`,
        { name, templateId, chatPrompt },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      let redirectUrl = `/editor/${response.data.workspace.id}`;

      if (trigger) {
        redirectUrl += `?prompt=${encodeURIComponent(name)}`;
      }

      router.push(redirectUrl);
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
