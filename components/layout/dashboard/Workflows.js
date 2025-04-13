"use client";

import { Input, ButtonGroup, Button, Tabs, Tab } from "@heroui/react";
import { Grid2X2, List } from "lucide-react";
import { useState } from "react";
import GridCard from "./cards/GridCard";
import ListCard from "./cards/ListCard";
import WorkflowEmptyState from "./WorkflowEmpty";

export default function Workflows() {
  const [view, setView] = useState("grid");
  const [tab, setTab] = useState("all");

  return (
    <main className="container mx-auto py-8">
      <div className="flex w-full justify-between">
        <Input
          variant="outline"
          placeholder="Search Workflows"
          className="w-[350px] shadow-none border-black/50 border rounded-lg"
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

      {/* <WorkflowEmptyState /> */}

      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <GridCard
            flow={{
              name: "Workflow 1",
              createdAt: new Date().getTime(),
              nodes: [1, 2],
              edges: [1, 2, 3],
            }}
          />
        </div>
      )}

      {view === "list" && (
        <div className="space-y-2 mt-4">
          {" "}
          <ListCard
            flow={{
              name: "Workflow 1",
              createdAt: new Date().getTime(),
              nodes: [1, 2],
              edges: [1, 2, 3],
            }}
          />{" "}
        </div>
      )}
    </main>
  );
}
