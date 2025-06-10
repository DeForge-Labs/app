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

export default function Workflows() {
  const defaultView = localStorage.getItem("defaultView") || "grid";
  const defaultTab = localStorage.getItem("defaultTab") || "all";
  const [view, setView] = useState(defaultView);
  const [tab, setTab] = useState(defaultTab);
  const workflows = useSelector((state) => state.team.workflows);
  const isWorkflowInitializing = useSelector(
    (state) => state.team.isWorkflowInitializing
  );
  const router = useRouter();
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

  useEffect(() => {
    localStorage.setItem("defaultView", view);
    localStorage.setItem("defaultTab", tab);
  }, [view, tab]);

  return (
    <main className="container mx-auto py-6">
      <div className="flex w-full justify-between items-center">
        <Input
          variant="outline"
          placeholder="Search Workflows"
          className="w-[350px] shadow-none border-black/50 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border border-black/50 rounded-lg text-black/80 text-xs"
            onPress={() => {
              router.push(`/templates`);
            }}
          >
            Browse Templates
          </Button>
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
            tabList: "relative border-1 h-12",
            tabContent: "text-black/80 cursor-pointer w-[120px] text-xs",
            cursor: "h-10 top-1",
          }}
          selectedKey={tab}
          onSelectionChange={setTab}
        >
          <Tab key="all" title="All Workflows" className="py-6" />
          <Tab key="recent" title="Recently Modified" className="py-6" />
        </Tabs>

        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            className="border border-black/80 rounded-lg text-xs rounded-r-none h-11"
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
            className="border border-black/80 rounded-lg text-xs rounded-l-none h-11"
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
