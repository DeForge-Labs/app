"use client";

import axios from "axios";
import { toast } from "sonner";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function useSocial() {
  const { setWorkflowSocial } = useWorkspaceStore();

  const getSocial = async (workflowId) => {
    try {
      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/getSocial/${workflowId}`,
        {},
      );

      setWorkflowSocial(response.data.social);

      return response.data.social;
    } catch (err) {
      console.log(err);
      toast.error("Failed to load environment variables");
      return null;
    }
  };

  const handleYouTube = async (workflowId) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=youtube`,
      {},
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleTwitter = async (workflowId) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=twitter`,
      {},
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleLinkedIn = async (workflowId) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=linkedin`,
      {},
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleGmailTrigger = async (workflowId) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=gmail_trigger`,
      {},
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleGmailRead = async (workflowId) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=gmail_read`,
      {},
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleSlack = async (workflowId) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=slack`,
      {},
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleGoogleSheets = async (workflowId) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=google_sheets`,
      {},
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleHubSpot = async (workflowId) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=hubspot`,
      {},
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  };

  const handleNotion = async (workflowId) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/workflow/connectSocial/${workflowId}?social=notion`,
      {},
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
    handleNotion,
    getSocial,
  };
}
