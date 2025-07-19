"use client";

import { Badge } from "@/components/ui/badge";
import { Button, Input } from "@heroui/react";
import {
  Copy,
  ExternalLink,
  FlaskConical,
  Loader2,
  Play,
  Rocket,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useExecution from "@/hooks/useExecution";

import DeployButton from "../toolPanel/DeployButton";
import FallbackButton from "../toolPanel/FallbackButton";

export default function ApiDeployments() {
  const workflow = useSelector((state) => state.workflow.workflow);

  const isRunning = useSelector((state) => state.run.isRunning);
  const type = useSelector((state) => state.run.type);

  const rawUrl = process.env.NEXT_PUBLIC_API_URL.slice(0, -4);

  const { handleTest, handleRun, handleRunLive } = useExecution();

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

        {workflow?.status !== "TEST" && (
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg flex flex-col items-center justify-center mt-1">
            <div className="p-4 rounded-full text-yellow-500 bg-background">
              <FlaskConical size={24} />
            </div>
            <div className="text-xs font-medium mt-4">Test Deployment</div>
            <p className="text-xs text-black/60 dark:text-background mt-1 max-w-[400px] text-wrap text-center">
              Production Deployment is active. Not sure about the changes? Click
              on Rollback to revert to Test Deployment
            </p>
          </div>
        )}

        <div className="text-sm font-medium">Endpoint URL</div>
        <div className="flex items-center gap-2 justify-between h-[40px]">
          <Input
            placeholder="Endpoint URL"
            className="w-full border border-black/50 rounded-md dark:border-background"
            variant="outline"
            value={`${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${workflow?.id}`}
            onChange={(e) => {}}
            isDisabled={workflow?.status !== "TEST"}
          />
          <Button
            className="h-full p-2 bg-black/80 text-background rounded-md w-[40px] dark:bg-background dark:text-black"
            variant="icon"
            size="icon"
            onPress={() => {
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${workflow?.id}`
              );
              toast("Endpoint URL copied to clipboard");
            }}
            isDisabled={workflow?.status !== "TEST"}
          >
            <Copy size={16} />
          </Button>
          <Button
            className="h-full p-2 bg-black/80 text-background rounded-md w-[40px] dark:bg-background dark:text-black"
            variant="icon"
            size="icon"
            onPress={() => {
              window.open(
                `${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${workflow?.id}`,
                "_blank"
              );
            }}
            isDisabled={workflow?.status !== "TEST"}
          >
            <ExternalLink size={16} />
          </Button>
        </div>

        <div className="text-xs text-black/60 mt-2 flex gap-2 items-center dark:text-background">
          <Play className="w-[13px] h-[13px]" />
          <p className="text-wrap flex-1">
            Click on Run to check the output of the workflow, without Saving the
            workflow
          </p>
        </div>

        <div className="text-xs text-black/60 flex gap-2 items-center dark:text-background">
          <FlaskConical className="w-[13px] h-[13px]" />
          <p className="text-wrap flex-1">
            Click on Test to check the endpoint URL, the endpoint url checks the
            last saved version of the workflow
          </p>
        </div>

        <div className="flex items-center w-full gap-2 mt-2">
          <Button
            className="h-full p-2 border-2 flex-1 border-black/50 rounded-lg gap-2 dark:border-background dark:text-background"
            variant="default"
            size="md"
            onPress={() => {
              handleRun();
            }}
            isDisabled={workflow?.status !== "TEST" || isRunning}
          >
            {isRunning && type === "raw" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Play size={16} />
            )}
            Run
          </Button>

          <Button
            className="h-full p-2 border-2 flex-1 border-black/50 rounded-lg gap-2 dark:border-background dark:text-background"
            variant="default"
            size="md"
            onPress={() => {
              handleTest();
            }}
            isDisabled={workflow?.status !== "TEST" || isRunning}
          >
            {isRunning && type === "test" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FlaskConical size={16} />
            )}
            Test
          </Button>
        </div>
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

        <div className="text-sm font-medium">Endpoint URL</div>
        <div className="flex items-center gap-2 justify-between h-[40px]">
          <Input
            placeholder="Endpoint URL"
            className="w-full border border-black/50 rounded-md dark:border-background"
            variant="outline"
            value={`${rawUrl}/live/${workflow?.id}`}
            onChange={(e) => {}}
            isDisabled={workflow?.status !== "LIVE"}
          />
          <Button
            className="h-full p-2 bg-black/80 text-background rounded-md w-[40px] dark:bg-background dark:text-black"
            variant="icon"
            size="icon"
            onPress={() => {
              navigator.clipboard.writeText(`${rawUrl}/live/${workflow?.id}`);
              toast("Endpoint URL copied to clipboard");
            }}
            isDisabled={workflow?.status !== "LIVE"}
          >
            <Copy size={16} />
          </Button>
          <Button
            className="h-full p-2 bg-black/80 text-background rounded-md w-[40px] dark:bg-background dark:text-black"
            variant="icon"
            size="icon"
            onPress={() => {
              window.open(`${rawUrl}/live/${workflow?.id}`, "_blank");
            }}
            isDisabled={workflow?.status !== "LIVE"}
          >
            <ExternalLink size={16} />
          </Button>
        </div>

        <div className="text-xs text-black/60 mt-2 flex gap-2 items-center dark:text-background">
          <Play className="w-[13px] h-[13px]" />
          <p className="text-wrap flex-1">
            Click on Run to check the output of the workflow through the
            endpoint URL
          </p>
        </div>

        {workflow?.status !== "LIVE" && (
          <div className="text-xs text-black/60 flex gap-2 items-center dark:text-background">
            <Rocket className="w-[13px] h-[13px]" />
            <p className="text-wrap flex-1">
              Click on Deploy to deploy the workflow to the production
              environment
            </p>
          </div>
        )}

        {workflow?.status === "LIVE" && (
          <div className="text-xs text-black/60 flex gap-2 items-center dark:text-background">
            <FlaskConical className="w-[13px] h-[13px]" />
            <p className="text-wrap flex-1">
              Click on Rollback to revert to the testing environment, this will
              make the production environment inactive.
            </p>
          </div>
        )}

        <div className="flex items-center w-full gap-2 mt-2">
          <Button
            className="h-full p-2 border-2 flex-1 border-black/50 rounded-lg gap-2 dark:border-background dark:text-background"
            variant="default"
            size="md"
            onPress={() => {
              handleRunLive();
            }}
            isDisabled={workflow?.status !== "LIVE" || isRunning}
          >
            {isRunning && type === "live" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Play size={16} />
            )}
            Run
          </Button>

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
