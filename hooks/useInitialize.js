import {
  setIsTeamInitializing,
  setTeam,
  setIsWorkflowInitializing,
  setWorkflows,
  setIsMembersInitializing,
  setMembers,
  setIsDefaultTemplatesInitializing,
  setDefaultTemplate,
  setWorkspace,
  setTemplates as setTemplatesTeam,
} from "@/redux/slice/TeamSlice";
import { setIsInitializing, setUser } from "@/redux/slice/UserSlice";
import {
  setWorkflow,
  setIsWorkflowInitializing as setWorkflowInitializing,
  setTeam as setTeamWorkflow,
  setIsLogInitializing,
  setLogs,
  setSelectedNode,
  setIsWorkspaceInitializing,
  setWorkspace as setEditorWorkspace,
  setIsFormInitializing,
  setForm,
  setNodes,
  setConnections,
  setWorkflowForce,
  setIsStatsInitializing,
  setCredits,
  setPlan,
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
import useSocial from "./useSocial";
import useTeams from "./useTeams";
import { loadComponents } from "@/redux/slice/formSlice";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import useFormStore from "@/store/useFormStore";

export default function useInitialize() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { getEnv } = useEnv();
  const { getSocial } = useSocial();
  const { getTeams, createTeam } = useTeams();
  const {
    setWorkspace,
    setWorkflow,
    setNodes,
    setConnections,
    setIsWorkspaceInitializing,
    setTeam,
    setIsWorkflowInitializing,
    setForm,
    setIsFormInitializing,
    setSessionId,
  } = useWorkspaceStore();

  const { loadComponents } = useFormStore();

  const loadUser = async (force = true, token = null) => {
    dispatch(setIsInitializing(true));
    try {
      const headers = {
        Authorization: `Bearer ${token || localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/get`,
        {},
        { headers }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        if (window.location.pathname === "/") {
          const teams = await getTeams();

          if (teams.length === 0) {
            router.push("/team/create");
          } else {
            const lastTeamId = localStorage.getItem(
              `team_${response.data.user.id}`
            );

            if (lastTeamId) {
              if (lastTeamId in teams) {
                router.push(`/dashboard/${lastTeamId}`);
              } else {
                router.push(`/dashboard/${teams[0].teamId}`);
                localStorage.setItem(
                  `team_${response.data.user.id}`,
                  teams[0].teamId
                );
              }
            } else {
              router.push(`/dashboard/${teams[0].teamId}`);
            }
          }
        }
        return response.data.user;
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

  const loadUserAndTeams = async (token = null) => {
    try {
      dispatch(setIsTeamsInitializing(true));
      const headers = {
        Authorization: `Bearer ${token || localStorage.getItem("token")}`,
      };

      await loadUser(false, token);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/list`,
        {},
        { headers }
      );

      if (response.data.success) {
        if (response.data.teams.length === 0) {
          const team = await createTeam("My Team", token);

          dispatch(setTeams([team]));

          return;
        }

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
        dispatch(setTemplate(response.data?.template || null));
        dispatch(setWorkflowForce(response.data?.template?.workflow || null));
        dispatch(setForm(response.data?.template?.form || null));
        dispatch(setNodes(response.data?.template?.workflow?.nodes || []));
        dispatch(
          setConnections(response.data?.template?.workflow?.edges || [])
        );
        dispatch(
          loadComponents(
            response.data?.template?.form?.formLayout?.components || []
          )
        );
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
      dispatch(setWorkspace(null));
      dispatch(setTemplatesTeam(null));
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

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/list/${teamId}`,
        { headers }
      );

      const templateResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/template/list/${teamId}`,
        { headers }
      );

      if (response.data.success && templateResponse.data.success) {
        dispatch(setWorkspace(response.data.workspaces));
        dispatch(setTemplatesTeam(templateResponse.data.templates));
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
      setIsWorkflowInitializing(true);
      setSelectedNode(null);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/get/${workflowId}`,
        {}
      );

      if (response.data.success) {
        setWorkflow({
          workflow: response.data.workflow,
          nodes: response.data.workflow.nodes,
          connections: response.data.workflow.edges,
        });

        await getEnv(workflowId);

        await getSocial(workflowId);
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
      setIsWorkflowInitializing(false);
    }
  };

  const loadFormById = async (formId) => {
    try {
      setIsFormInitializing(true);

      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/form/get/${formId}`
      );

      if (response.data.success) {
        setForm(response.data.form);

        loadComponents(response.data.form.formLayout?.components || []);
      } else {
        toast.error(response.data.message);
        if (response.data.status === 404 || response.data.status === 401) {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load form");
    } finally {
      setIsFormInitializing(false);
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

  const loadDefaultTemplates = async () => {
    try {
      dispatch(setIsDefaultTemplatesInitializing(true));

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/template/global`
      );

      if (response.data.success) {
        dispatch(setDefaultTemplate(response.data.templates));
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load default templates");
    } finally {
      dispatch(setIsDefaultTemplatesInitializing(false));
    }
  };

  const loadWorkspaceById = async (workspaceId) => {
    try {
      setIsWorkspaceInitializing(true);
      setIsWorkflowInitializing(true);
      setIsFormInitializing(true);

      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/get/${workspaceId}`
      );

      if (response.data.success) {
        setWorkspace(response.data.workspace);
        setWorkflow({
          workflow: response.data.workspace.workflow,
          nodes: response.data.workspace.workflow.nodes,
          connections: response.data.workspace.workflow.edges,
        });

        setForm(response.data.workspace.form);

        setTeam(response.data.workspace.team);

        loadComponents(
          response.data.workspace.form.formLayout?.components || []
        );

        setSessionId(Math.random().toString(36).substring(2, 9));

        await getEnv(response.data.workspace.workflow.id);

        await getSocial(response.data.workspace.workflow.id);
      } else {
        toast.error(response.data.message);
        if (response.data.status === 404 || response.data.status === 401) {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load workspace");
    } finally {
      setIsWorkspaceInitializing(false);
      setIsWorkflowInitializing(false);
      setIsFormInitializing(false);
    }
  };

  const loadStats = async (teamId) => {
    try {
      dispatch(setIsStatsInitializing(true));
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const creditsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/credits`,
        { headers }
      );

      if (creditsResponse.data.success) {
        dispatch(setCredits(creditsResponse.data.credits));

        const planResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/plan`,
          { headers }
        );

        if (planResponse.data.success) {
          dispatch(setPlan(planResponse.data));
        } else {
          toast.error(planResponse.data.message);
        }
      } else {
        toast.error(creditsResponse.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load stats");
    } finally {
      dispatch(setIsStatsInitializing(false));
    }
  };

  return {
    loadUser,
    loadTeam,
    loadWorkflow,
    loadWorkflowById,
    loadLogs,
    loadMembers,
    loadWorkspaceById,
    loadUserAndTeams,
    loadTemplate,
    loadTemplates,
    loadDefaultTemplates,
    loadFormById,
    loadStats,
  };
}
