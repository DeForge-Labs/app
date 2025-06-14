import {
  setIsTeamInitializing,
  setTeam,
  setIsWorkflowInitializing,
  setWorkflows,
  setIsMembersInitializing,
  setMembers,
} from "@/redux/slice/TeamSlice";
import { setIsInitializing, setUser } from "@/redux/slice/UserSlice";
import {
  setWorkflow,
  setIsWorkflowInitializing as setWorkflowInitializing,
  setTeam as setTeamWorkflow,
  setIsLogInitializing,
  setLogs,
} from "@/redux/slice/WorkflowSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import useEnv from "./useEnv";
import {
  setIsTeamsInitializing,
  setIsTemplateInitializing,
  setIsTemplatesInitializing,
  setTeams,
  setTemplate,
  setTemplates,
} from "@/redux/slice/templateSlice";

export default function useInitialize() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { getEnv } = useEnv();

  const loadUser = async (force = true) => {
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
        if (force) {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
      router.push("/");
    } finally {
      dispatch(setIsInitializing(false));
    }
  };

  const loadUserAndTeams = async () => {
    try {
      dispatch(setIsTeamsInitializing(true));
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      await loadUser(false);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/list`,
        {},
        { headers }
      );

      if (response.data.success) {
        dispatch(setTeams(response.data.teams));
      } else {
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setIsTeamsInitializing(false));
    }
  };

  const loadTemplate = async (templateId) => {
    try {
      dispatch(setIsTemplateInitializing(true));

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/template/get/${templateId}`
      );

      if (response.data.success) {
        dispatch(setTemplate(response.data.template));
      } else {
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setIsTemplateInitializing(false));
    }
  };

  const loadTemplates = async () => {
    try {
      dispatch(setIsTemplatesInitializing(true));
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/template/list`,
        { headers }
      );

      if (response.data.success) {
        dispatch(setTemplates(response.data.templates));
      } else {
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setIsTemplatesInitializing(false));
    }
  };

  const loadTeam = async (teamId) => {
    try {
      dispatch(setTeam(null));
      dispatch(setIsWorkflowInitializing(true));
      dispatch(setWorkflows(null));
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
      dispatch(setWorkflows(null));
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
        dispatch(
          setWorkflow({
            workflow: response.data.workflow,
            nodes: response.data.workflow.nodes,
            connections: response.data.workflow.edges,
          })
        );

        await getEnv(workflowId);

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

  const loadLogs = async (workflowId) => {
    try {
      dispatch(setIsLogInitializing(true));
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/logs/${workflowId}`,
        {},
        { headers }
      );

      if (response.data.success) {
        dispatch(setLogs(response.data.logs));
      } else {
        toast.error(response.data.message);
        if (response.data.status === 404 || response.data.status === 401) {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load logs");
    } finally {
      dispatch(setIsLogInitializing(false));
    }
  };

  const loadMembers = async (teamId) => {
    try {
      dispatch(setIsMembersInitializing(true));
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/team/members/${teamId}`,
        { headers }
      );

      if (response.data.success) {
        dispatch(setMembers(response.data.members));
      } else {
        toast.error(response.data.message);
        if (response.data.status === 404 || response.data.status === 401) {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load members");
    } finally {
      dispatch(setIsMembersInitializing(false));
    }
  };

  return {
    loadUser,
    loadTeam,
    loadWorkflow,
    loadWorkflowById,
    loadLogs,
    loadMembers,
    loadUserAndTeams,
    loadTemplate,
    loadTemplates,
  };
}
