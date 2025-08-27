"use client";

import { Badge } from "@/components/ui/badge";
import { FlaskConical, Mail, Rocket, Send, TriangleAlert } from "lucide-react";
import { useSelector } from "react-redux";

import DeployButton from "../toolPanel/DeployButton";
import FallbackButton from "../toolPanel/FallbackButton";

export default function GmailDeployment() {
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

        {workflow?.status === "TEST" && (
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg flex flex-col items-center justify-center mt-1">
            <div className="p-4 rounded-full text-yellow-500 bg-background">
              <Mail size={24} />
            </div>
            <div className="text-xs font-medium mt-4">Test Deployment</div>
            <p className="text-xs text-black/60 dark:text-background mt-1 max-w-[400px] text-wrap text-center">
              Workflows with Gmail Trigger can only be tested when a mail is
              received.
            </p>
          </div>
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
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg flex flex-col items-center justify-center mt-1">
            <div className="p-4 rounded-full text-yellow-500 bg-background">
              <TriangleAlert size={24} />
            </div>
            <div className="text-xs font-medium mt-4">
              Production Deployment
            </div>
            <p className="text-xs text-black/60 mt-1 max-w-[400px] dark:text-background text-wrap text-center">
              Deploy to production only after thorough testing, errors in
              production can cause loss of credits.
            </p>
          </div>
        )}

        {workflow?.status === "LIVE" && (
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg flex flex-col items-center justify-center mt-1">
            <div className="p-4 rounded-full text-yellow-500 bg-background">
              <Mail size={24} />
            </div>
            <div className="text-xs font-medium mt-4">
              Production Deployment
            </div>
            <p className="text-xs text-black/60 mt-1 max-w-[400px] dark:text-background text-wrap text-center">
              Workflows with Gmail Trigger can only be tested when a mail is
              received.
            </p>
          </div>
        )}

        {workflow?.status !== "LIVE" && (
          <div className="text-xs text-black/60 flex gap-2 items-center dark:text-background mt-2">
            <Rocket className="w-[13px] h-[13px]" />
            <p className="text-wrap flex-1">
              Click on Deploy to deploy the workflow to the production
              environment
            </p>
          </div>
        )}

        {workflow?.status === "LIVE" && (
          <div className="text-xs text-black/60 flex gap-2 items-center dark:text-background mt-2">
            <FlaskConical className="w-[13px] h-[13px]" />
            <p className="text-wrap flex-1">
              Click on Rollback to revert to the testing environment, this will
              make the production environment inactive.
            </p>
          </div>
        )}

        <div className="flex items-center w-full gap-2 mt-2">
          {workflow?.status !== "LIVE" && (
            <DeployButton
              className="h-full p-2 border-2 flex-1  bg-red-500 text-background border-black/50 rounded-lg gap-2 text-sm dark:border-background dark:text-background"
              showTooltip={false}
            />
          )}

          {workflow?.status === "LIVE" && (
            <FallbackButton
              className="h-full p-2 border-2 flex-1 bg-red-500 text-background border-black/50 rounded-lg gap-2 text-sm dark:border-background dark:text-background"
              showTooltip={false}
            />
          )}
        </div>
      </div>
    </>
  );
}
