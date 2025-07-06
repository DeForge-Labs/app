"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import useSocial from "./useSocial";
import axios from "axios";

export default function useConnectSocial() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const workflow = useSelector((state) => state.workflow.workflow);
  const { getSocial } = useSocial();

  const openConnectionPopup = (connectionRoute) => {
    return new Promise((resolve, reject) => {
      // Calculate popup dimensions and position
      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      // Open popup to your custom connection route
      const popup = window.open(
        connectionRoute,
        "_blank",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        reject(new Error("Popup blocked. Please allow popups for this site."));
        return;
      }

      let isResolved = false;
      let messageReceived = false;
      let successPopup = false;

      // Create BroadcastChannel for communication
      const channel = new BroadcastChannel("social_auth");

      // Listen for BroadcastChannel messages
      const handleBroadcastMessage = (event) => {
        console.log("Received broadcast message:", event.data);
        messageReceived = true;

        if (event.data.type === "SOCIAL_AUTH_SUCCESS") {
          if (!isResolved) {
            isResolved = true;
            cleanup();
            resolve({ success: true, data: event.data.payload });
          }
        } else if (event.data.type === "SOCIAL_AUTH_ERROR") {
          if (!isResolved) {
            isResolved = true;
            cleanup();
            reject(new Error(event.data.message || "Authentication failed"));
          }
        } else if (event.data.type === "SOCIAL_AUTH_CANCELLED") {
          if (!isResolved) {
            isResolved = true;
            cleanup();
            reject(new Error("Authentication cancelled by user"));
          }
        } else if (event.data.type === "SUCCESS_POPUP") {
          successPopup = true;
        }
      };

      channel.addEventListener("message", handleBroadcastMessage);

      // Enhanced popup closure detection
      const checkClosed = setInterval(() => {
        if (isResolved) return;

        if (popup.closed) {
          console.log("Popup detected as closed");

          // Give a grace period for any pending messages
          setTimeout(() => {
            if (!isResolved && !messageReceived) {
              if (successPopup) {
                return;
              }

              console.log("No message received, treating as cancelled");
              isResolved = true;
              cleanup();
              reject(new Error("Authentication cancelled by user"));
            }
          }, 5000); // 2 second grace period
        }
      }, 500); // Check every 500ms for more responsive detection

      // Send heartbeat to popup to check if it's still alive
      const sendHeartbeat = setInterval(() => {
        if (popup.closed || isResolved) return;

        try {
          // Send heartbeat via BroadcastChannel
          channel.postMessage({
            type: "PARENT_HEARTBEAT",
            timestamp: Date.now(),
          });
        } catch (e) {
          console.log("Failed to send heartbeat:", e);
        }
      }, 3000); // Send heartbeat every 3 seconds

      // Cleanup function
      const cleanup = () => {
        console.log("Cleaning up popup listeners");
        channel.removeEventListener("message", handleBroadcastMessage);
        channel.close();
        clearInterval(checkClosed);
        clearInterval(sendHeartbeat);
        clearTimeout(timeoutId);

        // Only close popup if it's still open
        if (!popup.closed) {
          popup.close();
        }
      };

      // Set timeout (5 minutes)
      const timeoutId = setTimeout(() => {
        if (!isResolved) {
          console.log("Authentication timeout reached");
          isResolved = true;
          cleanup();
          reject(new Error("Authentication timeout"));
        }
      }, 300000);

      console.log("Popup opened, waiting for messages...");
    });
  };

  const handleConnectSocial = async (key) => {
    try {
      setIsConnecting(true);

      // Build the connection route with parameters
      const connectionRoute = `/connection?workflowId=${
        workflow?.id || ""
      }&key=${key}`;

      // Open popup and wait for authentication
      const authResult = await openConnectionPopup(connectionRoute);

      await getSocial(workflow?.id);

      toast.success(`Successfully connected to ${key}!`);

      setIsOpen(false);
      return { success: true, data: authResult.data };
    } catch (error) {
      console.log(error);

      // Handle specific error types
      if (error.message.includes("Popup blocked")) {
        toast.error("Please allow popups and try again");
      } else if (error.message.includes("cancelled by user")) {
        toast.error("Authentication cancelled");
      } else if (error.message.includes("timeout")) {
        toast.error("Authentication timed out. Please try again");
      } else if (error.message.includes("access_denied")) {
        toast.error("Access denied. Please grant necessary permissions");
      } else {
        toast.error(error.message || "Authentication failed");
      }

      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectSocial = async (key) => {
    try {
      setIsConnecting(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/disconnectSocial/${workflow?.id}?social=${key}`,
        {},
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      await getSocial(workflow?.id);

      setIsOpen(false);

      toast.success(`Successfully disconnected from ${key}!`);

      return response.data.social;
    } catch (err) {
      console.log(err);
      toast.error("Failed to disconnect social");
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isConnecting,
    setIsConnecting,
    handleConnectSocial,
    handleDisconnectSocial,
  };
}
