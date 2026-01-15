"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function useRenameWorkspace(setIsOpen) {
  const router = useRouter();
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState("");

  const handleChangeWorkspaceName = async (workspaceid) => {
    try {
      setIsRenaming(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/rename/${workspaceid}`,
        { name }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsOpen(false);

      router.refresh();

      toast.success("Workspace name changed successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsRenaming(false);
    }
  };

  return {
    isRenaming,
    setIsRenaming,
    name,
    setName,
    handleChangeWorkspaceName,
  };
}
