"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useSocial from "@/hooks/useSocial";
import Logo from "@/components/ui/Logo";

export default function ConnectionMain() {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("workflowId");
  const key = searchParams.get("key");
  const {
    handleYouTube,
    handleTwitter,
    handleLinkedIn,
    handleGmailTrigger,
    handleGmailRead,
    handleSlack,
    handleGoogleSheets,
    handleHubSpot,
  } = useSocial();

  const connectionTypes = [
    {
      name: "YouTube",
      key: "youtube",
      type: "redirect",
    },
    {
      name: "Twitter",
      key: "twitter",
      type: "redirect",
    },
    {
      name: "LinkedIn",
      key: "linkedin",
      type: "redirect",
    },
    {
      name: "Gmail",
      key: "gmail_trigger",
      type: "redirect",
    },
    {
      name: "Gmail",
      key: "gmail_read",
      type: "redirect",
    },
    {
      name: "Slack",
      key: "slack",
      type: "redirect",
    },
    {
      name: "Google Sheets",
      key: "google_sheets",
      type: "redirect",
    },
    {
      name: "HubSpot",
      key: "hubspot",
      type: "redirect",
    },
  ];

  const connectionType = key
    ? connectionTypes.find((type) => type.key === key.toLowerCase()) || null
    : null;

  useEffect(() => {
    if (!connectionType) {
      setTimeout(() => {
        window.opener.postMessage(
          {
            type: "SOCIAL_AUTH_ERROR",
            message: "Connection not found",
          },
          window.location.origin
        );
      }, 3000);
    }

    if (connectionType) {
      if (connectionType.type === "redirect") {
        handleRedirectConnections();
      }
    }
  }, [connectionType]);

  const handleRedirectConnections = async () => {
    if (connectionType.key === "youtube") {
      try {
        const response = await handleYouTube(workflowId);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        window.location.href = response.data.authURL;
      } catch (error) {
        console.log(error);
        window.opener.postMessage(
          {
            type: "SOCIAL_AUTH_ERROR",
            message: error.message,
          },
          window.location.origin
        );
      }
    } else if (connectionType.key === "twitter") {
      try {
        const response = await handleTwitter(workflowId);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        window.location.href = response.data.authURL;
      } catch (error) {
        console.log(error);
        window.opener.postMessage(
          {
            type: "SOCIAL_AUTH_ERROR",
            message: error.message,
          },
          window.location.origin
        );
      }
    } else if (connectionType.key === "linkedin") {
      try {
        const response = await handleLinkedIn(workflowId);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        window.location.href = response.data.authURL;
      } catch (error) {
        console.log(error);
        window.opener.postMessage(
          {
            type: "SOCIAL_AUTH_ERROR",
            message: error.message,
          },
          window.location.origin
        );
      }
    } else if (connectionType.key === "gmail_trigger") {
      try {
        const response = await handleGmailTrigger(workflowId);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        window.location.href = response.data.authURL;
      } catch (error) {
        console.log(error);
        window.opener.postMessage(
          {
            type: "SOCIAL_AUTH_ERROR",
            message: error.message,
          },
          window.location.origin
        );
      }
    } else if (connectionType.key === "gmail_read") {
      try {
        const response = await handleGmailRead(workflowId);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        window.location.href = response.data.authURL;
      } catch (error) {
        console.log(error);
        window.opener.postMessage(
          {
            type: "SOCIAL_AUTH_ERROR",
            message: error.message,
          },
          window.location.origin
        );
      }
    } else if (connectionType.key === "slack") {
      try {
        const response = await handleSlack(workflowId);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        window.location.href = response.data.authURL;
      } catch (error) {
        console.log(error);
        window.opener.postMessage(
          {
            type: "SOCIAL_AUTH_ERROR",
            message: error.message,
          },
          window.location.origin
        );
      }
    } else if (connectionType.key === "google_sheets") {
      try {
        const response = await handleGoogleSheets(workflowId);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        window.location.href = response.data.authURL;
      } catch (error) {
        console.log(error);
        window.opener.postMessage(
          {
            type: "SOCIAL_AUTH_ERROR",
            message: error.message,
          },
          window.location.origin
        );
      }
    } else if (connectionType.key === "hubspot") {
      try {
        const response = await handleHubSpot(workflowId);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        window.location.href = response.data.authURL;
      } catch (error) {
        console.log(error);
        window.opener.postMessage(
          {
            type: "SOCIAL_AUTH_ERROR",
            message: error.message,
          },
          window.location.origin
        );
      }
    }
  };

  return (
    <>
      <div className="flex flex-col w-[350px]">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <Logo size={50} />
        </Link>

        <div className="flex flex-col items-center justify-center mt-10 h-[300px]">
          {connectionType && connectionType.type === "redirect" ? (
            <div className="flex flex-col items-center justify-center ">
              <div className="text-2xl font-bold text-foreground">
                Redirecting to {connectionType.name}
              </div>
              <div className="text-sm text-foreground/50">Please wait...</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center ">
              <div className="text-2xl font-bold text-foreground">
                Connection not found
              </div>
              <div className="text-sm text-foreground/50">Please try again</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
