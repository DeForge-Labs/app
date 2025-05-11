"use client";

import { Badge } from "@/components/ui/badge";
import { Button, Input } from "@heroui/react";
import {
  ExternalLink,
  FlaskConical,
  Play,
  Rocket,
  TriangleAlert,
} from "lucide-react";

export default function DeploymentTab() {
  return (
    <div className="flex-1 flex flex-col p-4 ">
      <h1 className="font-semibold text-xl">Deployments</h1>

      <div className="w-full border border-black/50 bg-black/5 p-4 rounded-lg mt-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">Test Environment</h3>
            <p className="text-xs text-black/60">
              Test your workflow on the test environment for Validation
            </p>
          </div>

          <Badge
            className="text-xs h-fit"
            style={{
              backgroundColor: "#C8E6C9",
              color: "#1B5E20",
            }}
          >
            Active
          </Badge>
        </div>

        <div className="text-sm font-medium">Endpoint URL</div>
        <div className="flex items-center gap-2 justify-between h-[40px]">
          <Input
            placeholder="Endpoint URL"
            className="w-full border border-black/50 rounded-md"
            variant="outline"
            value="https://test-api.example.com/workflows/1746981047077"
            onChange={(e) => {}}
          />
          <Button
            className="h-full p-2 bg-black/80 text-background rounded-md w-[40px]"
            variant="icon"
            size="icon"
            onPress={() => {}}
          >
            <ExternalLink size={16} />
          </Button>
        </div>

        <div className="text-xs text-black/60 mt-2 flex gap-2 items-center">
          <Play className="w-[13px] h-[13px]" />
          <p className="text-wrap flex-1">
            Click on Run to check the output of the workflow, without Saving the
            workflow
          </p>
        </div>

        <div className="text-xs text-black/60 flex gap-2 items-center">
          <FlaskConical className="w-[13px] h-[13px]" />
          <p className="text-wrap flex-1">
            Click on Test to check the endpoint URL, the endpoint url checks the
            last saved version of the workflow
          </p>
        </div>

        <div className="flex items-center w-full gap-2 mt-2">
          <Button
            className="h-full p-2 border-2 flex-1 border-black/50 rounded-lg gap-2"
            variant="default"
            size="md"
            onPress={() => {}}
          >
            <Play size={16} /> Run
          </Button>

          <Button
            className="h-full p-2 border-2 flex-1 border-black/50 rounded-lg gap-2"
            variant="default"
            size="md"
            onPress={() => {}}
          >
            <FlaskConical size={16} /> Test
          </Button>
        </div>
      </div>

      <div className="w-full border border-black/50 bg-black/5 p-4 rounded-lg mt-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="">
            <h3 className="font-semibold">Production Environment</h3>
            <p className="text-xs text-black/60">
              Deploy your workflow on the production environment for live use
            </p>
          </div>

          <Badge
            className="text-xs h-fit"
            style={{
              backgroundColor: "#FBC2C4",
              color: "#855C00",
            }}
          >
            Inactive
          </Badge>
        </div>

        <div className="bg-black/5 p-4 rounded-lg flex flex-col items-center justify-center mt-1">
          <div className="p-4 rounded-full text-yellow-500 bg-background">
            <TriangleAlert size={24} />
          </div>
          <div className="text-xs font-medium mt-4">Production Deployment</div>
          <p className="text-xs text-black/60 mt-1 max-w-[400px] text-wrap text-center">
            Deploy to production only after thorough testing, errors in
            production can cause loss of credits.
          </p>
        </div>

        <div className="text-sm font-medium">Endpoint URL</div>
        <div className="flex items-center gap-2 justify-between h-[40px]">
          <Input
            placeholder="Endpoint URL"
            className="w-full border border-black/50 rounded-md"
            variant="outline"
            value="https://test-api.example.com/workflows/1746981047077"
            onChange={(e) => {}}
            isDisabled
          />
          <Button
            className="h-full p-2 bg-black/80 text-background rounded-md w-[40px]"
            variant="icon"
            size="icon"
            onPress={() => {}}
            isDisabled
          >
            <ExternalLink size={16} />
          </Button>
        </div>

        <div className="text-xs text-black/60 mt-2 flex gap-2 items-center">
          <Play className="w-[13px] h-[13px]" />
          <p className="text-wrap flex-1">
            Click on Run to check the output of the workflow through the
            endpoint URL
          </p>
        </div>

        <div className="text-xs text-black/60 flex gap-2 items-center">
          <Rocket className="w-[13px] h-[13px]" />
          <p className="text-wrap flex-1">
            Click on Deploy to deploy the workflow to the production environment
          </p>
        </div>

        <div className="flex items-center w-full gap-2 mt-2">
          <Button
            className="h-full p-2 border-2 flex-1 border-black/50 rounded-lg gap-2"
            variant="default"
            size="md"
            onPress={() => {}}
            isDisabled
          >
            <Play size={16} /> Run
          </Button>

          <Button
            className="h-full p-2 border-2 flex-1 border-red-500 text-red-500 rounded-lg gap-2"
            variant="default"
            size="md"
            onPress={() => {}}
          >
            <Rocket size={16} /> Deploy
          </Button>
        </div>
      </div>
    </div>
  );
}
