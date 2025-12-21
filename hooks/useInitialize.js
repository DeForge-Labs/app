import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import useEnv from "./useEnv";

import useSocial from "./useSocial";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import useFormStore from "@/store/useFormStore";
import useChatStore from "@/store/useChatStore";

export default function useInitialize() {
  const router = useRouter();
  const { getEnv } = useEnv();
  const { getSocial } = useSocial();
  const pathname = usePathname();
  const {
    setWorkspace,
    setWorkflow,
    setSelectedNode,
    setIsWorkspaceInitializing,
    setTeam,
    setIsWorkflowInitializing,
    setForm,
    setIsFormInitializing,
    setSessionId,
    setIsLogInitializing,
    setLogs,
    setMode,
  } = useWorkspaceStore();

  const { loadComponents } = useFormStore();

  const { setIsChatInitializing, setMessages } = useChatStore();

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
      setIsLogInitializing(true);

      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflow/logs/${workflowId}`
      );

      if (response.data.success) {
        setLogs(response.data.logs);
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
      setIsLogInitializing(false);
    }
  };

  const loadChats = async (workflowId) => {
    try {
      setIsChatInitializing(true);

      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/history/${workflowId}?page=1&limit=10`
      );

      if (response.data.success) {
        setMessages(response.data?.messages || []);
      } else {
        toast.error(response.data.message);
        if (response.data.status === 404 || response.data.status === 401) {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load chats");
    } finally {
      setIsChatInitializing(false);
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
        if (response.data.workspace.workflow.status === "LIVE") {
          if (pathname === `/editor/${response.data.workspace.id}`) {
            router.push(`/viewer/${response.data.workspace.id}`);
          }

          setMode(response.data?.workspace?.type?.toLowerCase());
        } else {
          if (pathname === `/viewer/${response.data.workspace.id}`) {
            router.push(`/editor/${response.data.workspace.id}`);
          }
        }

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
        toast.error("Failed to load workspace");

        router.push("/");
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

  return {
    loadWorkflowById,
    loadLogs,
    loadWorkspaceById,
    loadFormById,

    loadChats,
  };
}
