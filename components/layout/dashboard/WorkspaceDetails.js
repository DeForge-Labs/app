"use client";

import React from "react";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { DynamicIcon } from "lucide-react/dynamic";

const getCategoryIcon = (category) => {
  switch (category) {
    case "Automation":
      return "zap";
    case "Marketing":
      return "megaphone";
    case "Sales":
      return "banknote";
    case "Human Resources":
      return "users";
    default:
      return "layout-template";
  }
};

export const WorkspaceDetails = ({ workspace }) => {
  return (
    <Card className="h-full rounded-none border-none bg-background dark:bg-dark shadow-none">
      <CardHeader className="flex-col border-b border-black/50 dark:border-background p-4">
        <div className="flex items-center bg-black/5 dark:bg-white/5 text-black dark:text-background border-black/50 dark:border-background border justify-center rounded-lg w-[60%] aspect-square">
          <DynamicIcon
            name={getCategoryIcon(workspace.category)}
            className="w-[60%] h-[60%]"
          />
        </div>
        <h2 className="text-lg font-medium ml-2 text-black dark:text-background mt-2">
          {workspace.name}
        </h2>
        <Chip color="primary" variant="flat" size="sm">
          {workspace.category}
        </Chip>
      </CardHeader>
      <CardBody className="flex flex-col justify-between p-4 text-black dark:text-background dark:bg-dark">
        <div>
          <p className="mb-4 text-sm opacity-70">{workspace.description}</p>
          <div className="flex gap-2 mb-4">
            <Chip size="sm" variant="flat">
              Template
            </Chip>
            <Chip size="sm" variant="flat">
              Workspace
            </Chip>
          </div>
          <div className="flex items-center text-default-500 text-sm">
            <DynamicIcon name="user" className="mr-1 w-4 h-4" />
            <span>By: The Deforge Team</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
