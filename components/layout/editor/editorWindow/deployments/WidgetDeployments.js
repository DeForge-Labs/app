"use client";

import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";

import DeployButton from "../toolPanel/DeployButton";
import FallbackButton from "../toolPanel/FallbackButton";
import WidgetIntegrationSection from "./WidgetIntegrationSection";

export default function WidgetDeployment() {
  const workflow = useSelector((state) => state.workflow.workflow);

  return (
    <>
      {" "}
      <div className="w-full border border-black/50 dark:border-background bg-black/5 p-4 rounded-lg mt-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">Test Environment</h3>
            <p className="text-xs text-black/60 dark:text-background">
              Test your workflow on the test environment for Validation
            </p>
          </div>

          {workflow?.status === "TEST" ? (
            <Badge
              className="text-xs h-fit"
              style={{
                backgroundColor: "#C8E6C9",
                color: "#1B5E20",
              }}
            >
              Active
            </Badge>
          ) : (
            <Badge
              className="text-xs h-fit"
              style={{
                backgroundColor: "#FBC2C4",
                color: "#855C00",
              }}
            >
              Inactive
            </Badge>
          )}
        </div>

        {workflow?.status === "LIVE" && (
          <FallbackButton
            className="h-full p-2 border-2 flex-1 bg-red-500 text-background border-black/50 rounded-lg gap-2 text-sm dark:border-background dark:text-background mt-1"
            showTooltip={false}
          />
        )}
      </div>
      <div className="w-full border border-black/50 bg-black/5 p-4 rounded-lg mt-4 flex flex-col gap-2 dark:border-background dark:text-background">
        <div className="flex justify-between dark:text-background">
          <div className="">
            <h3 className="font-semibold">Production Environment</h3>
            <p className="text-xs text-black/60 dark:text-background">
              Deploy your workflow on the production environment for live use
            </p>
          </div>

          {workflow?.status === "LIVE" ? (
            <Badge
              className="text-xs h-fit"
              style={{
                backgroundColor: "#C8E6C9",
                color: "#1B5E20",
              }}
            >
              Active
            </Badge>
          ) : (
            <Badge
              className="text-xs h-fit"
              style={{
                backgroundColor: "#FBC2C4",
                color: "#855C00",
              }}
            >
              Inactive
            </Badge>
          )}
        </div>

        {workflow?.status !== "LIVE" && (
          <div className="flex items-center w-full gap-2 mt-2">
            <DeployButton
              className="h-full p-2 border-2 flex-1  bg-red-500 text-background border-black/50 rounded-lg gap-2 text-sm dark:border-background dark:text-background"
              showTooltip={false}
            />
          </div>
        )}
      </div>
      <WidgetIntegrationSection workflowId={workflow?.id} />
    </>
  );
}
