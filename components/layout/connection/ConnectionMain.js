"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useSocial from "@/hooks/useSocial";

export default function ConnectionMain() {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("workflowId");
  const key = searchParams.get("key");
  const user = useSelector((state) => state.user.user);
  const isInitializing = useSelector((state) => state.user.isInitializing);
  const { handleYouTube, handleTwitter } = useSocial();

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
  ];

  const connectionType = key
    ? connectionTypes.find((type) => type.key === key.toLowerCase()) || null
    : null;

  useEffect(() => {
    if (user && !connectionType && !isInitializing) {
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

    if (!user && !isInitializing) {
      setTimeout(() => {
        window.opener.postMessage(
          {
            type: "SOCIAL_AUTH_ERROR",
            message: "User not found",
          },
          window.location.origin
        );
      }, 3000);
    }

    if (user && connectionType && !isInitializing) {
      if (connectionType.type === "redirect") {
        handleRedirectConnections();
      }
    }
  }, [connectionType, user, isInitializing]);

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
    }
  };

  return (
    <>
      <div className="flex flex-col w-[350px] dark:bg-dark dark:text-background">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <Image
            src="/logo/logo-black.svg"
            alt="Logo"
            width={27}
            height={27}
            className="dark:invert"
          />
          <span className="font-bold inline-block text-4xl dark:text-background">
            Deforge
          </span>
        </Link>

        <div className="flex flex-col items-center justify-center mt-10 h-[300px]">
          {connectionType && connectionType.type === "redirect" ? (
            <div className="flex flex-col items-center justify-center ">
              <div className="text-2xl font-bold dark:text-background">
                Redirecting to {connectionType.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-background">
                Please wait...
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center ">
              <div className="text-2xl font-bold dark:text-background">
                Connection not found
              </div>
              <div className="text-sm text-gray-500 dark:text-background">
                Please try again
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
