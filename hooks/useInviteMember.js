"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export default function useInviteMember() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [role, setRole] = useState(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [invitation, setInvitation] = useState(null);

  const handleInviteMember = async (teamId) => {
    try {
      setIsInviting(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/invite`,
        { role }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setInvitation(response.data.invitation);

      setIsInviteOpen(true);

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
    isInviteOpen,
    setIsInviteOpen,
    handleInviteMember,
  };
}
