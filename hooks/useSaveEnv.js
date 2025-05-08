"use client";

import { useState } from "react";
import useEnv from "./useEnv";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";

export default function useSaveEnv() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSavingEnv, setIsSavingEnv] = useState(false);
  const { getEnv } = useEnv();
  const workflow = useSelector((state) => state.workflow.workflow);

  const handleSaveEnv = async (key, value, setValue) => {
    try {
      setIsSavingEnv(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/saveEnv/${workflow?.id}`,
        { key, value },
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      await getEnv(workflow?.id);

      setValue("");

      toast.success("Environment saved successfully");
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
