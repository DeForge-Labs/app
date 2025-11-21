"use client";

import { setIsRunning, setType } from "@/redux/slice/runSlice";
import axios from "axios";
import { toast } from "sonner";
import useWorkflowStore from "@/store/useWorkspaceStore";

export default function useExecution() {
  const { nodes, connections, workflow, setIsRunning, setExecutionType } =
    useWorkflowStore();

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setExecutionType("raw");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/run/${workflow?.id}`,
        { nodes, edges: connections }
      );

      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleTest = async () => {
    try {
      setIsRunning(true);
      setExecutionType("test");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${workflow?.id}`
      );

      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunLive = async () => {
    try {
      setIsRunning(true);
      setExecutionType("live");

      const url = process.env.NEXT_PUBLIC_API_URL.slice(0, -4);

      const response = await axios.get(`${url}/live/${workflow?.id}`);

      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    handleRun,
    handleTest,
    handleRunLive,
  };
}
