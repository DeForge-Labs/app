"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useInitialize from "@/hooks/useInitialize";
import useLibrary from "@/hooks/useLibrary";
import useSocket from "@/hooks/useSocket";

export default function WorkflowProvider({ children, params }) {
  const user = useSelector((state) => state.user.user);
  const nodeRegistry = useSelector((state) => state.library.nodeRegistry);
  const { loadWorkflowById, loadLogs } = useInitialize();
  const { loadNodeRegistry } = useLibrary();
  const workflow = useSelector((state) => state.workflow.workflow);
  const {
    initializeWebSocket,
    subscribeToWorkflow,
    unsubscribeFromWorkflow,
    socket,
  } = useSocket();

  // Load node registry once on component mount
  useEffect(() => {
    loadNodeRegistry();
  }, []);

  // Load workflow when user, params, and nodeRegistry are available
  useEffect(() => {
    if (user && nodeRegistry && nodeRegistry.length > 0) {
      if (!params?.value) return;

      try {
        const parsedValue = JSON.parse(params.value);
        const id = parsedValue.id;
        if (!id) return;

        loadWorkflowById(id);
        loadLogs(id);
        initializeWebSocket();
      } catch (error) {
        console.error("Error parsing params value:", error);
      }
    }
  }, [user, params, nodeRegistry]);

  // Handle workflow subscription with proper cleanup
  useEffect(() => {
    if (workflow?.id && socket?.id) {
      // Subscribe to the workflow
      subscribeToWorkflow(workflow.id);

      // Cleanup function to unsubscribe when component unmounts
      // or when workflow/socket changes
      return () => {
        if (workflow.id) {
          unsubscribeFromWorkflow(workflow.id);
        }
      };
    }
  }, [workflow?.id, socket?.id]);

  return <>{children}</>;
}
