"use client";

import React from "react";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { DynamicIcon } from "lucide-react/dynamic";

export const WorkspaceDetails = ({ workspace }) => {
  return (
    <Card className="h-full rounded-none border-none bg-background dark:bg-dark shadow-none">
      <CardHeader className="flex-col border-b border-black/50 dark:border-background p-4">
        <div className="flex items-center bg-black/5 dark:bg-white/5 text-black dark:text-background border-black/50 dark:border-background border justify-center rounded-lg w-[60%] aspect-square">
          <DynamicIcon name={workspace.iconId} className="w-[60%] h-[60%]" />
        </div>
        <h2 className="text-lg font-medium ml-2 text-black dark:text-background mt-2">
          {workspace.name}
        </h2>
        <Chip color="primary" variant="flat" size="sm" className="mt-1">
          {workspace.category}
        </Chip>
      </CardHeader>
      <CardBody className="flex flex-col justify-between p-4 text-black dark:text-background dark:bg-dark">
        <div>
          <p className="mb-4 text-sm opacity-70">{workspace.description}</p>
          <div className="flex gap-2 mb-4">
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
        </div>
      </CardBody>
    </Card>
  );
};
