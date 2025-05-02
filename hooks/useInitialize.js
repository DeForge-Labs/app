import {
  setIsTeamInitializing,
  setTeam,
  setIsWorkflowInitializing,
  setWorkflows,
} from "@/redux/slice/TeamSlice";
import { setIsInitializing, setUser } from "@/redux/slice/UserSlice";
import {
  setWorkflow,
  setIsWorkflowInitializing as setWorkflowInitializing,
  setNodes,
  setConnections,
  setTeam as setTeamWorkflow,
} from "@/redux/slice/WorkflowSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function useInitialize() {
  const dispatch = useDispatch();
  const router = useRouter();

  const loadUser = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/get`,
        {},
        { headers }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
      } else {
        router.push("/");
      }
    } catch (err) {
      console.log(err);
      router.push("/");
    } finally {
      dispatch(setIsInitializing(false));
    }
  };

  const loadTeam = async (teamId) => {
    try {
      dispatch(setIsTeamInitializing(true));
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/team/get/${teamId}`,
        { headers }
      );

      if (response.data.success) {
        dispatch(setTeam(response.data.team));
      } else {
        toast.error(response.data.message);
        router.push("/");
      }
    } catch (err) {
      console.log(err);
      router.push("/");
    } finally {
      dispatch(setIsTeamInitializing(false));
    }
  };

  const loadWorkflow = async (teamId) => {
    try {
      dispatch(setIsWorkflowInitializing(true));
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/list/${teamId}`,
        {},
        { headers }
      );

      if (response.data.success) {
        dispatch(setWorkflows(response.data.workflows));
      } else {
        toast.error(response.data.message);
        if (response.data.status === 404 || response.data.status === 401) {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load workflows");
    } finally {
      dispatch(setIsWorkflowInitializing(false));
    }
  };

  const loadWorkflowById = async (workflowId) => {
    try {
      dispatch(setWorkflowInitializing(true));
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/get/${workflowId}`,
        {},
        { headers }
      );

      if (response.data.success) {
        dispatch(setWorkflow(response.data.workflow));
        dispatch(setNodes(response.data.workflow.nodes));
        dispatch(setConnections(response.data.workflow.connections));
        dispatch(setTeamWorkflow(response.data.workflow.team));
      } else {
        toast.error(response.data.message);
        if (response.data.status === 404 || response.data.status === 401) {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load workflow");
    } finally {
      dispatch(setWorkflowInitializing(false));
    }
  };

  return { loadUser, loadTeam, loadWorkflow, loadWorkflowById };
}
