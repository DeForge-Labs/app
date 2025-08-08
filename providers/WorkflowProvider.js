"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useInitialize from "@/hooks/useInitialize";
import useLibrary from "@/hooks/useLibrary";
import useSocket from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredits, setLogs, setPlan } from "@/redux/slice/WorkflowSlice";

export default function WorkflowProvider({ children }) {
  const user = useSelector((state) => state.user.user);
  const nodeRegistry = useSelector((state) => state.library.nodeRegistry);
  const { loadWorkspaceById, loadLogs, loadStats } = useInitialize();
  const { loadNodeRegistry } = useLibrary();
  const workflow = useSelector((state) => state.workflow.workflow);
  const workspace = useSelector((state) => state.workflow.workspace);
  const {
    initializeWebSocket,
    subscribeToWorkflow,
    unsubscribeFromWorkflow,
    socket,
  } = useSocket();
  const params = useParams();
  const dispatch = useDispatch();

  // Load node registry once on component mount
  useEffect(() => {
    loadNodeRegistry();
  }, []);

  // Load workflow when user, params, and nodeRegistry are available
  useEffect(() => {
    if (user && nodeRegistry && nodeRegistry.length > 0) {
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
  }, [user, params?.id, nodeRegistry]);

  useEffect(() => {
    if (!params?.id) return;

    if (params?.id !== workspace?.id) {
      return;
    }

    if (workspace?.workflowId) {
      loadLogs(workspace?.workflowId);
    }

    if (workspace?.teamId) {
      loadStats(workspace?.teamId);
    }

    return () => {
      dispatch(setLogs([]));
      dispatch(setCredits(null));
      dispatch(setPlan(null));
    };
  }, [workspace?.workflowId, params?.id, workspace?.teamId]);

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
