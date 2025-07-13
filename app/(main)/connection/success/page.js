"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import StartContainer from "@/components/ui/StartContainer";

export default function ConnectionSuccess() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  const type = searchParams.get("type");
  const message = searchParams.get("message");
  const social = searchParams.get("social");
  const workflowId = searchParams.get("workflowId");
  const isSuccess = type === "SOCIAL_AUTH_SUCCESS";

  useEffect(() => {
    console.log("ConnectionSuccess component mounted");

    // Create BroadcastChannel for communication
    const channel = new BroadcastChannel("social_auth");
    let heartbeatReceived = false;

    // Listen for heartbeat from parent
    const handleParentMessage = (event) => {
      if (event.data.type === "PARENT_HEARTBEAT") {
        heartbeatReceived = true;
        console.log("Received heartbeat from parent");
      }
    };

    channel.addEventListener("message", handleParentMessage);

    channel.postMessage({
      type: "SUCCESS_POPUP",
      timestamp: Date.now(),
    });

    // Wait for parent to be ready, then send message
    const sendMessageToParent = () => {
      console.log("Sending message to parent via BroadcastChannel:", {
        type,
        message,
        social,
        workflowId,
      });

      const payload = isSuccess
        ? {
            social: social,
            workflowId: workflowId,
            success: true,
          }
        : null;

      try {
        channel.postMessage({
          type: type,
          message: message,
          payload: payload,
        });

        console.log("Message sent successfully via BroadcastChannel");
        setIsProcessing(false);

        // Close popup after sending message
        setTimeout(() => {
          console.log("Closing popup window");
          window.close();
        }, 1000);
      } catch (e) {
        console.error("Failed to send message via BroadcastChannel:", e);
        setIsProcessing(false);
      }
    };

    // Check if parent is ready and send message
    const checkParentReady = () => {
      // Send a test message to see if parent responds
      channel.postMessage({
        type: "POPUP_READY",
        timestamp: Date.now(),
      });

      // Wait a bit for heartbeat response
      setTimeout(() => {
        sendMessageToParent();
      }, 500);
    };

    // Start the process after a brief delay to ensure everything is loaded
    const initTimeout = setTimeout(() => {
      checkParentReady();
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(initTimeout);
      channel.removeEventListener("message", handleParentMessage);
      channel.close();
    };
  }, [type, message, social, workflowId, isSuccess]);

  return (
    <StartContainer>
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
          <div className="text-2xl font-bold dark:text-background">
            {isSuccess ? "Success!" : "Error"}
          </div>
          <div className="text-sm text-gray-500 dark:text-background">
            {message}
          </div>

          <div className="text-sm text-gray-500 dark:text-background">
            {isProcessing ? (
              <>
                <p>Processing...</p>
              </>
            ) : (
              <p>Complete! Closing window...</p>
            )}
          </div>
        </div>
      </div>
    </StartContainer>
  );
}
