"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function useRemoveMember() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveMember = async (teamId, userEmail) => {
    try {
      setIsRemoving(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/team/remove`,
        { userEmail }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsOpen(false);

      router.refresh();

      toast.success("Member Removed successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isRemoving,
    setIsRemoving,
    handleRemoveMember,
  };
}
