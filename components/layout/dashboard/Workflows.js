"use client";

import { Input, ButtonGroup, Button, Tabs, Tab } from "@heroui/react";
import { Grid2X2, List } from "lucide-react";
import { useEffect, useState } from "react";
import GridCard from "./cards/GridCard";
import ListCard from "./cards/ListCard";
import WorkflowEmptyState from "./WorkflowEmpty";
import WorkflowLoading from "./WorkflowLoading";
import { useSelector } from "react-redux";
import WorkflowEmptySearch from "./WorkflowEmptySearch";
import CreateWorkflowButton from "./CreateWorkflowButton";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function Workflows() {
  const defaultView = localStorage.getItem("defaultView") || "grid";
  const defaultTab = localStorage.getItem("defaultTab") || "workspaces";
  const [view, setView] = useState(defaultView);
  const [tab, setTab] = useState(defaultTab);
  const workspace = useSelector((state) => state.team.workspace);
  const templates = useSelector((state) => state.team.templates);
  const isWorkflowInitializing = useSelector(
    (state) => state.team.isWorkflowInitializing
  );
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!workspace) return;
    const filtered = workspace.filter((workflow) =>
      workflow.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredWorkspaces(filtered);
  }, [search, workspace]);

  useEffect(() => {
    if (!templates) return;
    const filtered = templates.filter((template) =>
      template.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTemplates(filtered);
  }, [search, templates]);

  useEffect(() => {
    localStorage.setItem("defaultView", view);
    localStorage.setItem("defaultTab", tab);
  }, [view, tab]);

  return (
    <main className="container mx-auto py-6">
      <div className="flex w-full justify-between items-center">
        <Input
          variant="outline"
          placeholder={
            tab === "workspaces" ? "Search Workspaces" : "Search Templates"
          }
          className="w-[350px] shadow-none border-black/50 dark:border-background border rounded-lg dark:text-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <CreateWorkflowButton />
        </div>
      </div>

      <div className="flex w-full justify-between items-center mt-4">
        <Tabs
          aria-label="Tabs radius"
          radius={"md"}
          className=" w-fit"
          variant="bordered"
          classNames={{
            tabList:
              "relative border-1 h-12 border-black/50 dark:border-background",
            tabContent:
              "text-black/80 group-data-[selected=true]:text-background cursor-pointer w-[120px] text-xs dark:text-background dark:group-data-[selected=true]:text-black",
            cursor: "h-10 top-1 bg-black/80 dark:bg-background",
          }}
          selectedKey={tab}
          onSelectionChange={setTab}
        >
          <Tab key="workspaces" title="Workspaces" className="py-6" />
          <Tab key="templates" title="Templates" className="py-6" />
        </Tabs>

        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            className="border border-black/80 rounded-lg text-xs rounded-r-none h-11 dark:border-background dark:text-background"
            style={{
              backgroundColor:
                view === "grid"
                  ? resolvedTheme === "dark"
                    ? "#fffcea"
                    : "black"
                  : "transparent",
              opacity:
                view === "grid" ? (resolvedTheme === "dark" ? 1 : 0.8) : 1,
              color:
                view === "grid"
                  ? resolvedTheme === "dark"
                    ? "black"
                    : "white"
                  : resolvedTheme === "dark"
                  ? "white"
                  : "black",
            }}
            onPress={() => setView("grid")}
          >
            <Grid2X2 size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border border-black/80 rounded-lg text-xs rounded-l-none h-11 dark:border-background dark:text-background"
            style={{
              backgroundColor:
                view === "list"
                  ? resolvedTheme === "dark"
                    ? "#fffcea"
                    : "black"
                  : "transparent",
              opacity:
                view === "list" ? (resolvedTheme === "dark" ? 1 : 0.8) : 1,
              color:
                view === "list"
                  ? resolvedTheme === "dark"
                    ? "black"
                    : "white"
                  : resolvedTheme === "dark"
                  ? "white"
                  : "black",
            }}
            onPress={() => setView("list")}
          >
            <List size={16} />
          </Button>
        </ButtonGroup>
      </div>

      {isWorkflowInitializing && <WorkflowLoading />}

      {tab === "workspaces" &&
        workspace?.length === 0 &&
        !isWorkflowInitializing && <WorkflowEmptyState type="workspace" />}

      {tab === "templates" &&
        templates?.length === 0 &&
        !isWorkflowInitializing && <WorkflowEmptyState type="template" />}

      {workspace &&
        tab === "workspaces" &&
        workspace?.length > 0 &&
        !isWorkflowInitializing &&
        filteredWorkspaces?.length === 0 &&
        search && (
          <WorkflowEmptySearch setSearch={setSearch} type="workspace" />
        )}

      {templates &&
        tab === "templates" &&
        templates?.length > 0 &&
        !isWorkflowInitializing &&
        filteredTemplates?.length === 0 &&
        search && <WorkflowEmptySearch setSearch={setSearch} type="template" />}

      {view === "grid" &&
        tab === "workspaces" &&
        workspace?.length > 0 &&
        !isWorkflowInitializing && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredWorkspaces.map((workflow) => (
              <GridCard flow={workflow} key={workflow.id} type="workspace" />
            ))}
          </div>
        )}

      {view === "grid" &&
        tab === "templates" &&
        templates?.length > 0 &&
        !isWorkflowInitializing && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredTemplates.map((template) => (
              <GridCard flow={template} key={template.id} type="template" />
            ))}
          </div>
        )}

      {view === "list" &&
        tab === "workspaces" &&
        workspace?.length > 0 &&
        !isWorkflowInitializing && (
          <div className="space-y-4 mt-4">
            {filteredWorkspaces.map((workflow) => (
              <ListCard flow={workflow} key={workflow.id} type="workspace" />
            ))}
          </div>
        )}

      {view === "list" &&
        tab === "templates" &&
        templates?.length > 0 &&
        !isWorkflowInitializing && (
          <div className="space-y-4 mt-4">
            {filteredTemplates.map((template) => (
              <ListCard flow={template} key={template.id} type="template" />
            ))}
          </div>
        )}
    </main>
  );
}
