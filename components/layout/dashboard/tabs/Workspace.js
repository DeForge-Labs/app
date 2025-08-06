"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Input, Button, ButtonGroup } from "@heroui/react";
import { Grid2X2, List } from "lucide-react";
import WorkflowLoading from "../WorkflowLoading";
import WorkflowEmptyState from "../WorkflowEmpty";
import ListCard from "../cards/ListCard";
import GridCard from "../cards/GridCard";
import WorkflowEmptySearch from "../WorkflowEmptySearch";

export default function Workspace() {
  const defaultView = localStorage.getItem("defaultView") || "grid";
  const [view, setView] = useState(defaultView);
  const workspace = useSelector((state) => state.team.workspace);
  const isWorkflowInitializing = useSelector(
    (state) => state.team.isWorkflowInitializing
  );
  const { resolvedTheme } = useTheme();
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!workspace) return;
    const filtered = workspace.filter((workflow) =>
      workflow.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredWorkspaces(filtered);
  }, [search, workspace]);

  useEffect(() => {
    localStorage.setItem("defaultView", view);
  }, [view]);

  return (
    <div className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-6">
      <div className="flex w-full justify-between items-center">
        <Input
          variant="outline"
          placeholder="Search Workspaces"
          className="w-[350px] shadow-none border-black/50 dark:border-background border rounded-lg dark:text-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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

      {workspace?.length === 0 && !isWorkflowInitializing && (
        <WorkflowEmptyState type="workspace" />
      )}

      {workspace &&
        workspace?.length > 0 &&
        !isWorkflowInitializing &&
        filteredWorkspaces?.length === 0 &&
        search && (
          <WorkflowEmptySearch setSearch={setSearch} type="workspace" />
        )}

      {view === "grid" && workspace?.length > 0 && !isWorkflowInitializing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredWorkspaces.map((workflow) => (
            <GridCard flow={workflow} key={workflow.id} type="workspace" />
          ))}
        </div>
      )}

      {view === "list" && workspace?.length > 0 && !isWorkflowInitializing && (
        <div className="space-y-4 mt-4">
          {filteredWorkspaces.map((workflow) => (
            <ListCard flow={workflow} key={workflow.id} type="workspace" />
          ))}
        </div>
      )}
    </div>
  );
}
