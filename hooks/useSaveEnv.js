"use client";

import { useState } from "react";
import useEnv from "./useEnv";
import { toast } from "sonner";
import axios from "axios";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function useSaveEnv() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSavingEnv, setIsSavingEnv] = useState(false);
  const { getEnv } = useEnv();
  const { workflow } = useWorkspaceStore();

  const handleSaveEnv = async (key, value, setValue) => {
    try {
      setIsSavingEnv(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/saveEnv/${workflow?.id}`,
        { key, value }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      await getEnv(workflow?.id);

      setValue("");

      toast.success(response.data.message);
      setIsOpen(false);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSavingEnv(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isSavingEnv,
    setIsSavingEnv,
    handleSaveEnv,
  };
}
