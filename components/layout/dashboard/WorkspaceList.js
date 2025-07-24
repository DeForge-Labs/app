"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { DynamicIcon } from "lucide-react/dynamic";

export const WorkspaceList = ({
  workspaces,
  selectedWorkspace,
  onSelectWorkspace,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {workspaces.map((workspace) => (
        <Card
          key={workspace.id}
          isPressable
          isHoverable
          variant="flat"
          className={`w-[calc(50%-0.5rem)] shadow-none rounded-lg border-black/80 dark:border-white/80 border relative bg-black/5 ${
            workspace.id === selectedWorkspace.id
              ? "border-primary dark:border-primary"
              : ""
          }`}
          onPress={() => onSelectWorkspace(workspace)}
        >
          {workspace.id !== "blank" && (
            <div className="absolute top-0 right-0 bg-black/5 flex items-center gap-1 py-1 rounded-bl-lg p-2">
              <DynamicIcon
                name="user"
                className="text-black dark:text-background w-3 h-3"
              />
              <p className="text-xs text-black dark:text-background">
                {workspace.totalClones}
              </p>
            </div>
          )}
          <CardBody className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
                <DynamicIcon
                  name={workspace.iconId}
                  className="text-black dark:text-background"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h3 className="font-medium text-sm text-black dark:text-background">
                  {workspace.name}
                </h3>
                <p className="text-tiny text-default-500 dark:text-background line-clamp-2">
                  {workspace.description}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
