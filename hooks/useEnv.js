"use client";

import { setWorkflowEnv } from "@/redux/slice/WorkflowSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function useEnv() {
  const dispatch = useDispatch();

  const getEnv = async (workflowId) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/getEnv/${workflowId}`,
        {},
        { headers }
      );

      dispatch(setWorkflowEnv(response.data.env));

      return response.data.env;
    } catch (err) {
      console.log(err);
      toast.error("Failed to load environment variables");
      return null;
    }
  };

  return {
    getEnv,
  };
}
