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

export default function Workflows() {
  const [view, setView] = useState("grid");
  const [tab, setTab] = useState("all");
  const workflows = useSelector((state) => state.team.workflows);
  const isWorkflowInitializing = useSelector(
    (state) => state.team.isWorkflowInitializing
  );
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!workflows) return;
    const filtered = workflows.filter((workflow) =>
      workflow.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredWorkflows(filtered);
  }, [search, workflows]);

  useEffect(() => {
    if (!workflows) return;
    if (tab === "recent") {
      const sorted = [...workflows].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setFilteredWorkflows(sorted);
    } else {
      setFilteredWorkflows(workflows);
    }
  }, [tab, workflows]);

  return (
    <main className="container mx-auto py-8">
      <div className="flex w-full justify-between">
        <Input
          variant="outline"
          placeholder="Search Workflows"
          className="w-[350px] shadow-none border-black/50 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            className="border border-black/80 rounded-lg text-xs rounded-r-none h-full"
            style={{
              backgroundColor: view === "grid" ? "black" : "transparent",
              opacity: view === "grid" ? 0.8 : 1,
              color: view === "grid" ? "white" : "black",
            }}
            onPress={() => setView("grid")}
          >
            <Grid2X2 size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border border-black/80 rounded-lg text-xs rounded-l-none h-full"
            style={{
              backgroundColor: view === "list" ? "black" : "transparent",
              opacity: view === "list" ? 0.8 : 1,
              color: view === "list" ? "white" : "black",
            }}
            onPress={() => setView("list")}
          >
            <List size={16} />
          </Button>
        </ButtonGroup>
      </div>

      <Tabs
        aria-label="Tabs radius"
        radius={"md"}
        className="mt-4 w-fit"
        variant="bordered"
        classNames={{
          tabList: "relative border-1 h-14",
          tabContent: "text-black/80 cursor-pointer w-[120px] text-xs",
        }}
        selectedKey={tab}
        onSelectionChange={setTab}
      >
        <Tab key="all" title="All Workflows" className="py-6" />
        <Tab key="recent" title="Recently Modified" className="py-6" />
      </Tabs>

      {isWorkflowInitializing && <WorkflowLoading />}

      {workflows?.length === 0 && !isWorkflowInitializing && (
        <WorkflowEmptyState />
      )}

      {workflows &&
        workflows?.length > 0 &&
        !isWorkflowInitializing &&
        filteredWorkflows?.length === 0 &&
        search && <WorkflowEmptySearch setSearch={setSearch} />}

      {view === "grid" && workflows?.length > 0 && !isWorkflowInitializing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredWorkflows.map((workflow) => (
            <GridCard flow={workflow} key={workflow.id} />
          ))}
        </div>
      )}

      {view === "list" && workflows?.length > 0 && !isWorkflowInitializing && (
        <div className="space-y-4 mt-4">
          {filteredWorkflows.map((workflow) => (
            <ListCard flow={workflow} key={workflow.id} />
          ))}
        </div>
      )}
    </main>
  );
}
