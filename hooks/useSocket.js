"use client";

import { useState } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addLog, addNewLog } from "@/redux/slice/WorkflowSlice";

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  const initializeWebSocket = () => {
    if (socket) {
      // If a socket already exists, disconnect it
      socket.disconnect();

      setSocket(null);
    }

    const token = `Bearer ${localStorage.getItem("token")}`;

    const websocket = io(
      process.env.NEXT_PUBLIC_API_URL.split("/api")[0] + "/",
      {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        auth: { token },
        transports: ["websocket", "polling"],
      }
    );

    setSocket(websocket);

    // Set up event listeners
    websocket.on("connect", () => {
      console.log("WebSocket connected");
    });

    websocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    websocket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    websocket.on("workflow_execution", (log) => {
      dispatch(addLog(log));
      dispatch(addNewLog(log));
    });

    websocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    return websocket;
  };

  function subscribeToWorkflow(workflowId) {
    if (!socket) {
      console.log("WebSocket not initialized");
      return;
    }

    socket.emit("subscribe", workflowId);

    console.log("Subscribed to workflow", workflowId);
  }

  function unsubscribeFromWorkflow(workflowId) {
    if (!socket) {
      console.error("WebSocket not initialized");
      return;
    }

    socket.emit("unsubscribe", workflowId);
  }

  function getSocket() {
    return socket;
  }

  function closeWebSocket() {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }

  return {
    socket,
    initializeWebSocket,
    subscribeToWorkflow,
    unsubscribeFromWorkflow,
    getSocket,
    closeWebSocket,
  };
}
