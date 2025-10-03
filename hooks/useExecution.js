"use client";

import { setIsRunning, setType } from "@/redux/slice/runSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

export default function useExecution() {
  const dispatch = useDispatch();
  const workflow = useSelector((state) => state.workflow.workflow);
  const nodes = useSelector((state) => state.workflow.nodes);
  const connections = useSelector((state) => state.workflow.connections);

  const handleRun = async () => {
    try {
      dispatch(setIsRunning(true));
      dispatch(setType("raw"));

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/run/${workflow?.id}`,
        { nodes, edges: connections },
        { headers }
      );

      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setIsRunning(false));
    }
  };

  const handleTest = async () => {
    try {
      dispatch(setIsRunning(true));
      dispatch(setType("test"));

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
      dispatch(setIsRunning(false));
    }
  };

  const handleRunLive = async () => {
    try {
      dispatch(setIsRunning(true));
      dispatch(setType("live"));

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
      dispatch(setIsRunning(false));
    }
  };

  return {
    handleRun,
    handleTest,
    handleRunLive,
  };
}
