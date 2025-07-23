"use client";

import useWorkflow from "@/hooks/useCreateWorkflow";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { GitBranch, Loader2, Plus, Terminal } from "lucide-react";
import { useState } from "react";
import { WorkspaceDetails } from "./WorkspaceDetails";
import { WorkspaceList } from "./WorkspaceList";
import { DynamicIcon } from "lucide-react/dynamic";

const categories = [
  { name: "New Workspace" },
  { name: "Automation" },
  { name: "Marketing" },
  { name: "Sales" },
  { name: "Human Resources" },
];

const dummyWorkspaces = [
  {
    id: "blank",
    name: "Blank Workspace",
    category: "New Workspace",
    description: "Start with a clean slate, no pre-built templates.",
  },
  {
    id: "auto1",
    name: "Email Automation",
    category: "Automation",
    description: "Automate your email campaigns, no pre-built templates.",
  },
  {
    id: "auto2",
    name: "Social Media Scheduler",
    category: "Automation",
    description: "Schedule posts across platforms, no pre-built templates.",
  },
  {
    id: "market1",
    name: "Lead Generation",
    category: "Marketing",
    description: "Capture and nurture leads, no pre-built templates.",
  },
  {
    id: "sales1",
    name: "Sales Pipeline",
    category: "Sales",
    description: "Manage your sales process, no pre-built templates.",
  },
  {
    id: "hr1",
    name: "Onboarding Process",
    category: "Human Resources",
    description: "Streamline employee onboarding, no pre-built templates.",
  },
];

export default function CreateWorkflowButton() {
  const {
    isOpen,
    setIsOpen,
    isCreatingWorkflow,
    workflowName,
    setWorkflowName,
    handleCreateWorkflow,
  } = useWorkflow();

  const [selectedWorkspace, setSelectedWorkspace] = useState(
    dummyWorkspaces[0]
  );

  const onClose = () => {
    setIsOpen(false);
    setSelectedWorkspace(null);
  };

  return (
    <>
      <Button
        variant="outline"
        size="md"
        className="bg-black/80 rounded-lg text-background text-xs dark:bg-background dark:text-black"
        onPress={() => {
          setIsOpen(true);
        }}
      >
        <Plus size={16} />
        New Agent
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background dark:bg-dark dark:border-background p-1"
        onClose={() => setIsOpen(false)}
        size="5xl"
        closeButton={<div></div>}
        isDismissable={!isCreatingWorkflow}
        isKeyboardDismissDisabled={isCreatingWorkflow}
        hideCloseButton={isCreatingWorkflow}
      >
        <ModalContent className="p-0">
          <ModalHeader className="p-4 flex-col">
            <h3 className="text-lg font-bold dark:text-background">
              Choose a Template
            </h3>
            <p className="text-xs opacity-70 font-normal text-black dark:text-background">
              Select a template to get started
            </p>
          </ModalHeader>
          <ModalBody className="p-0 bg-background dark:bg-dark border-y dark:border-background border-black">
            <div className="flex h-[600px] rounded-none overflow-hidden">
              <div className="w-1/3 border-r border-black dark:border-background ">
                <WorkspaceDetails
                  workspace={selectedWorkspace}
                  onClose={onClose}
                />
              </div>
              <Card className="flex-1 h-full rounded-none bg-background dark:bg-dark shadow-none">
                <CardBody className="p-4 hide-scroll">
                  <div className="space-y-6">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        className="gap-2 text-black dark:text-background"
                      >
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Terminal size={14} />
                          {category.name}
                        </h3>
                        <WorkspaceList
                          workspaces={dummyWorkspaces.filter(
                            (w) => w.category === category.name
                          )}
                          selectedWorkspace={selectedWorkspace}
                          onSelectWorkspace={setSelectedWorkspace}
                        />
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter className=" flex w-full gap-2 px-4">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isCreatingWorkflow}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={handleCreateWorkflow}
              isDisabled={isCreatingWorkflow || !workflowName}
            >
              {isCreatingWorkflow ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Use This Template"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
