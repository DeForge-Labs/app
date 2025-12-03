"use client";
import { useEffect } from "react";
import useInitialize from "@/hooks/useInitialize";
import useSocket from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import useNodeLibraryStore from "@/store/useNodeLibraryStore";
import useWorkflowStore from "@/store/useWorkspaceStore";

export default function WorkflowProvider({ children }) {
  const { loadWorkspaceById, loadLogs, loadChats } = useInitialize();
  const { fetchNodeRegistry, nodeRegistry } = useNodeLibraryStore();
  const { workspace, setLogs, workflow } = useWorkflowStore();
  const {
    initializeWebSocket,
    subscribeToWorkflow,
    unsubscribeFromWorkflow,
    socket,
  } = useSocket();
  const params = useParams();

  useEffect(() => {
    fetchNodeRegistry();
  }, []);

  useEffect(() => {
    if (nodeRegistry && nodeRegistry.length > 0) {
      if (!params?.id) return;

      try {
        const id = params.id;
        if (!id) return;

        loadWorkspaceById(id);
        initializeWebSocket();
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
      loadChats(workspace?.workflowId);
    }

    return () => {
      setLogs([]);
    };
  }, [workspace?.workflowId, params?.id]);

  useEffect(() => {
    if (workflow?.id && socket?.id) {
      subscribeToWorkflow(workflow.id);

      return () => {
        if (workflow.id) {
          unsubscribeFromWorkflow(workflow.id);
        }
      };
    }
  }, [workflow?.id, socket?.id]);

  return <>{children}</>;
}
