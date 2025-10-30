"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function useChangeRole() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [role, setRole] = useState(null);

  const handleChangeRole = async (teamId, userEmail) => {
    try {
      setIsChanging(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/team/change-role/${teamId}`,
        { role, userEmail }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsOpen(false);

      router.refresh();

      toast.success("Role Changed successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsChanging(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isChanging,
    setIsChanging,
    role,
    setRole,
    handleChangeRole,
  };
}
