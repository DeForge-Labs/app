"use client";

import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function useUseTemplate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUsingTemplate, setIsUsingTemplate] = useState(false);
  const teams = useSelector((state) => state.template.teams);
  const [team, setTeam] = useState((teams && teams[0]?.team.id) || null);
  const template = useSelector((state) => state.template.template);
  const router = useRouter();

  const handleUseTemplate = async () => {
    try {
      setIsUsingTemplate(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/template/duplicate/${team}/${template?.id}`,
        {},
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setIsOpen(false);
      router.push(`/dashboard/${team}`);

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
    isOpen,
    setIsOpen,
    team,
    setTeam,
    isUsingTemplate,
    setIsUsingTemplate,
    handleUseTemplate,
  };
}
