"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function useChangeIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingIcon, setIsChangingIcon] = useState(false);
  const [iconId, setIconId] = useState(null);
  const router = useRouter();

  const handleChangeIcon = async (appId) => {
    try {
      setIsChangingIcon(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/change-icon/${appId}`,
        { iconId }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      router.refresh();

      setIsOpen(false);

      toast.success("Icon Changed successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsChangingIcon(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isChangingIcon,
    setIsChangingIcon,
    iconId,
    setIconId,
    handleChangeIcon,
  };
}
