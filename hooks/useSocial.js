"use client";

import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setWorkflowSocial } from "@/redux/slice/WorkflowSlice";

export default function useSocial() {
  const dispatch = useDispatch();

  const getSocial = async (workflowId) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/getSocial/${workflowId}`,
        {},
        { headers }
      );

      dispatch(setWorkflowSocial(response.data.social));

      return response.data.social;
    } catch (err) {
      console.log(err);
      toast.error("Failed to load environment variables");
      return null;
    }
  };

  const handleYouTube = async (workflowId) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=youtube`,
      {},
      { headers }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleTwitter = async (workflowId) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=twitter`,
      {},
      { headers }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleLinkedIn = async (workflowId) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=linkedin`,
      {},
      { headers }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleGmailTrigger = async (workflowId) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=gmail_trigger`,
      {},
      { headers }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleGmailRead = async (workflowId) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=gmail_read`,
      {},
      { headers }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleSlack = async (workflowId) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=slack`,
      {},
      { headers }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleGoogleSheets = async (workflowId) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=google_sheets`,
      {},
      { headers }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleHubSpot = async (workflowId) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=hubspot`,
      {},
      { headers }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  return {
    handleYouTube,
    handleTwitter,
    handleLinkedIn,
    handleGmailTrigger,
    handleGmailRead,
    handleSlack,
    handleGoogleSheets,
    handleHubSpot,
    getSocial,
  };
}
