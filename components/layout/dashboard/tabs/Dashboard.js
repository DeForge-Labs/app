"use client";

import { useSelector } from "react-redux";
import TemplateGridCard from "./TemplateGridCard";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import {
  Coins,
  FileQuestion,
  LayoutTemplate,
  Waypoints,
  RefreshCcw,
} from "lucide-react";
import GridCard from "../cards/GridCard";
import CreateWorkflowButton from "../CreateWorkflowButton";
import LogoAnimation from "@/components/ui/LogoAnimation";
import useUserCredits from "@/hooks/useUserCredits";
import useUserPlan from "@/hooks/useUserPlan";

export default function Dashboard() {
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.team.workspace);
  const defaultTemplates = useSelector((state) => state.team.defaultTemplate);
  const isDefaultTemplatesInitializing = useSelector(
    (state) => state.team.isDefaultTemplatesInitializing
  );
  const templates = useSelector((state) => state.team.templates);
  const team = useSelector((state) => state.team.team);
  const [top3Templates, setTop3Templates] = useState([]);
  const [recentWorkflows, setRecentWorkflows] = useState([]);
  const [recentTemplates, setRecentTemplates] = useState([]);
  const isWorkflowInitializing = useSelector(
    (state) => state.team.isWorkflowInitializing
  );
  const { credits, isLoading, fetchUserCredits, refreshCredits } =
    useUserCredits();
  const {
    fetchUserPlan,
    getPlanName,
    isLoading: isPlanLoading,
  } = useUserPlan();

  // Fetch credits and plan when team is available
  useEffect(() => {
    if (team?.id) {
      fetchUserCredits(team.id);
      fetchUserPlan(team.id);
    }
  }, [team?.id, fetchUserCredits, fetchUserPlan]);

  const handleRefreshCredits = async () => {
    if (team?.id) {
      await refreshCredits(team.id);
    }
  };

  useEffect(() => {
    if (defaultTemplates) {
      const top3 = [...defaultTemplates]
        .sort((a, b) => b.totalClones - a.totalClones)
        .slice(0, 3);
      setTop3Templates(top3);
    }

    return () => {
      setTop3Templates([]);
    };
  }, [defaultTemplates]);

  useEffect(() => {
    if (workspace) {
      const recent = [...workspace]
        .sort(
          (a, b) =>
            new Date(b?.workflow?.updatedAt).getTime() -
            new Date(a?.workflow?.updatedAt).getTime()
        )
        .slice(0, 3);

      setRecentWorkflows(recent);
    }

    return () => {
      setRecentWorkflows([]);
    };
  }, [workspace]);

  useEffect(() => {
    if (templates) {
      const recent = [...templates]
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 3);
      setRecentTemplates(recent);
    }

    return () => {
      setRecentTemplates([]);
    };
  }, [templates]);

  if (isDefaultTemplatesInitializing || isWorkflowInitializing)
    return <LogoAnimation />;

  return (
    <div className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 mt-2">
          <div className="flex flex-col gap-0">
            <p className="text-4xl dark:text-background">
              Hi{" "}
              {user?.name.length > 20
                ? user?.name.slice(0, 20) + "..."
                : user?.name}
              ,
            </p>
            <p className="text-5xl dark:text-background font-semibold mt-2">
              What are we deploying today?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          <div className="bg-black/5 border border-black/50 dark:border-white/50 dark:bg-white/5 rounded-lg p-4 relative overflow-hidden">
            <h1 className="text-lg font-bold dark:text-background">Credits</h1>
            <p className="text-sm dark:text-background">Your credit balance</p>
            <div className="flex flex-row gap-4 mb-2">
              <div>
                <p className="text-3xl font-bold dark:text-background mt-3">
                  {isLoading ? "..." : credits !== null ? credits : "N/A"}
                </p>
              </div>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                onPress={handleRefreshCredits}
                isLoading={isLoading}
                isDisabled={!team?.id}
                className="mt-3.5 border border-black/50 dark:border-white/50"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>

            <Coins className="absolute -bottom-5 -right-5 h-24 w-24 opacity-10 dark:text-background" />
          </div>
          <div className="bg-black/5 border border-black/50 dark:border-white/50 dark:bg-white/5 rounded-lg p-4  relative overflow-hidden">
            <h1 className="text-lg font-bold dark:text-background">
              Workspaces
            </h1>
            <p className="text-sm dark:text-background">Your workspaces</p>
            <p className="text-3xl font-bold dark:text-background mt-3">
              {workspace ? workspace?.length : 0}
            </p>

            <LayoutTemplate className="absolute -bottom-5 -right-5 h-24 w-24 opacity-10 dark:text-background" />
          </div>
          <div className="bg-black/5 border border-black/50 dark:border-white/50 dark:bg-white/5 rounded-lg p-4 relative overflow-hidden">
            <h1 className="text-lg font-bold dark:text-background">Plan</h1>
            <p className="text-sm dark:text-background">Your Current plan</p>
            <p className="text-3xl font-bold dark:text-background mt-3">
              {isPlanLoading ? "..." : getPlanName()}
            </p>

            <Waypoints className="absolute -bottom-5 -right-5 h-24 w-24 opacity-10 dark:text-background" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0">
            <p className="text-lg font-bold dark:text-background">
              Popular Templates
            </p>
            <p className="text-sm dark:text-background">
              Discover templates that are popular with our community
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 -mt-2">
          {top3Templates?.length > 0 &&
            !isDefaultTemplatesInitializing &&
            top3Templates.map((template, index) => (
              <TemplateGridCard flow={template} key={index} />
            ))}

          {top3Templates?.length === 0 && !isDefaultTemplatesInitializing && (
            <Card className="overflow-hidden h-[310px] text-black/80 justify-between transition-all hover:shadow-md bg-transparent shadow-none border border-black/80 dark:border-background rounded-lg dark:text-background border-dashed">
              <CardHeader className="p-4 pb-2 flex flex-col items-start">
                <div className="flex items-center justify-between w-full">
                  <span className="truncate font-semibold">
                    No templates found
                  </span>
                </div>
              </CardHeader>
              <CardBody className="p-4 pt-2 justify-end">
                <div className="h-full bg-black/5 dark:bg-white/5 rounded-md flex items-center justify-center border border-black/80 dark:border-background border-dashed">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <FileQuestion className="h-12 w-12" />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0">
            <p className="text-lg font-bold dark:text-background">
              Recent Workspaces
            </p>
            <p className="text-sm dark:text-background">
              Your recent modified workspaces
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 -mt-2">
          {recentWorkflows?.length > 0 &&
            !isWorkflowInitializing &&
            recentWorkflows.map((workflow, index) => (
              <GridCard flow={workflow} key={index} />
            ))}

          {recentWorkflows?.length < 3 && !isWorkflowInitializing && (
            <Card className="overflow-hidden h-[270px] text-black/80 justify-between transition-all hover:shadow-md bg-transparent shadow-none border border-black/80 dark:border-background rounded-lg dark:text-background border-dashed">
              <CardHeader className="p-4 pb-2 flex flex-col items-start">
                <div className="flex items-center justify-between w-full">
                  <span className="truncate font-semibold">
                    Create New Workspace
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Start building your first AI agent from scratch or grab a
                  template to get started.
                </p>
              </CardHeader>
              <CardBody className="p-4 pt-2 justify-end">
                <div className="h-full bg-black/5 dark:bg-white/5 rounded-md flex items-center justify-center border border-black/80 dark:border-background border-dashed">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <CreateWorkflowButton />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0">
            <p className="text-lg font-bold dark:text-background">
              Published Templates
            </p>
            <p className="text-sm dark:text-background">
              Your recent published templates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 -mt-2">
          {recentTemplates?.length > 0 &&
            !isWorkflowInitializing &&
            recentTemplates.map((template, index) => (
              <GridCard flow={template} type="template" key={index} />
            ))}

          {recentTemplates?.length === 0 && !isWorkflowInitializing && (
            <Card className="overflow-hidden h-[270px] text-black/80 justify-between transition-all hover:shadow-md bg-transparent shadow-none border border-black/80 dark:border-background rounded-lg dark:text-background border-dashed">
              <CardHeader className="p-4 pb-2 flex flex-col items-start">
                <div className="flex items-center justify-between w-full">
                  <span className="truncate font-semibold">
                    No Published Templates
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Deploy your first template to share with the community
                </p>
              </CardHeader>
              <CardBody className="p-4 pt-2 justify-end">
                <div className="h-full bg-black/5 dark:bg-white/5 rounded-md flex items-center justify-center border border-black/80 dark:border-background border-dashed">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <FileQuestion className="h-12 w-12" />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
