"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { DynamicIcon } from "lucide-react/dynamic";
import { Chip } from "@heroui/react";
import { Input } from "@heroui/react";
import { GitBranch } from "lucide-react";

export default function CreateWorkspaceSection({
  workspace,
  workspaceName,
  setWorkspaceName,
}) {
  return (
    <div>
      <Card className="h-full rounded-none border-none bg-background dark:bg-dark shadow-none">
        <CardHeader className="flex-col border-b border-black/50 dark:border-background p-4">
          <div className="flex items-center bg-black/5 dark:bg-white/5 text-black dark:text-background border-black/50 dark:border-background border justify-center rounded-lg w-[30%] aspect-square">
            <DynamicIcon name={workspace.iconId} className="w-[60%] h-[60%]" />
          </div>
          <h2 className="text-lg font-medium ml-2 text-black dark:text-background mt-2">
            {workspace.name}
          </h2>
          <Chip color="primary" variant="flat" size="sm" className="mt-1">
            {workspace.category}
          </Chip>

          <p className="mb-2 mt-2 text-sm opacity-70 text-center w-[60%] text-black dark:text-background">
            {workspace.description}
          </p>
          <div className="flex gap-2 mb-4 w-[60%] flex-wrap items-center justify-center">
            {workspace.tags.map((tag, index) => (
              <Chip key={index} size="sm" variant="flat">
                {tag}
              </Chip>
            ))}
          </div>
          <div className="flex items-center text-default-500 text-sm">
            <DynamicIcon name="user" className="mr-1 w-4 h-4" />
            <span>{workspace.author}</span>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col justify-between p-4 text-black dark:text-background dark:bg-dark">
          <Input
            type="text"
            placeholder="Enter workspace name"
            className="border border-black/40 rounded-lg -mt- shadow-none dark:border-background dark:text-background"
            size="lg"
            variant="outline"
            startContent={
              <GitBranch className="text-black/40 dark:text-background" />
            }
            isClearable
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            onClear={() => setWorkspaceName("")}
          />
        </CardBody>
      </Card>
    </div>
  );
}
