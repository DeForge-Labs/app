"use client";

import { useState } from "react";
import useInitialize from "./useInitialize";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPanel } from "@/redux/slice/WorkflowSlice";

export default function useDeployWorkflow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const { loadWorkflowById } = useInitialize();
  const workflow = useSelector((state) => state.workflow.workflow);
  const dispatch = useDispatch();

  const handleDeployWorkflow = async () => {
    try {
      setIsDeploying(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/deploy/${workflow?.id}`,
        {},
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      loadWorkflowById(workflow?.id);
      setIsOpen(false);
      dispatch(setPanel(2));

      toast.success("Workflow deployed successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isDeploying,
    setIsDeploying,
    handleDeployWorkflow,
  };
}
