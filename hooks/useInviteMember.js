"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import axios from "axios";

export default function useInviteMember() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [role, setRole] = useState("VIEWER");
  const team = useSelector((state) => state.team.team);
  const [invitation, setInvitation] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setInvitation(null);
    }
  }, [isOpen]);

  const handleInviteMember = async () => {
    try {
      setIsInviting(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/invite`,
        { role, teamId: team?.id },
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setInvitation(response.data.invitation);

      toast.success("Code Generated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsInviting(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isInviting,
    setIsInviting,
    role,
    setRole,
    invitation,
    handleInviteMember,
  };
}
