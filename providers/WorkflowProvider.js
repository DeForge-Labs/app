"use client";
import { useEffect } from "react";
import useInitialize from "@/hooks/useInitialize";
import useSocket from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import useNodeLibraryStore from "@/store/useNodeLibraryStore";
import useWorkflowStore from "@/store/useWorkspaceStore";

export default function WorkflowProvider({ children }) {
  const { loadWorkspaceById, loadLogs } = useInitialize();
  const { fetchNodeRegistry, nodeRegistry } = useNodeLibraryStore();
  const { workspace, setLogs } = useWorkflowStore();
  const {
    initializeWebSocket,
    subscribeToWorkflow,
    unsubscribeFromWorkflow,
    socket,
  } = useSocket();
  const params = useParams();

  // Load node registry once on component mount
  useEffect(() => {
    fetchNodeRegistry();
  }, []);

  // Load workflow when user, params, and nodeRegistry are available
  useEffect(() => {
    if (nodeRegistry && nodeRegistry.length > 0) {
      if (!params?.id) return;

      try {
        const id = params.id;
        if (!id) return;

        loadWorkspaceById(id);
        // initializeWebSocket();
      } catch (error) {
        console.error("Error parsing params value:", error);
      }
    }
  }, [params?.id, nodeRegistry]);

  useEffect(() => {
    if (!params?.id) return;

    if (params?.id !== workspace?.id) {
      return;
    }

    if (workspace?.workflowId) {
      loadLogs(workspace?.workflowId);
    }

    return () => {
      setLogs([]);
    };
  }, [workspace?.workflowId, params?.id]);

  // // Handle workflow subscription with proper cleanup
  // useEffect(() => {
  //   if (workflow?.id && socket?.id) {
  //     // Subscribe to the workflow
  //     subscribeToWorkflow(workflow.id);

  //     // Cleanup function to unsubscribe when component unmounts
  //     // or when workflow/socket changes
  //     return () => {
  //       if (workflow.id) {
  //         unsubscribeFromWorkflow(workflow.id);
  //       }
  //     };
  //   }
  // }, [workflow?.id, socket?.id]);

  return <>{children}</>;
}
