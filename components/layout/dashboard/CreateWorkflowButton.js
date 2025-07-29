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
  Input,
} from "@heroui/react";
import { GitBranch, Loader2, Plus, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { WorkspaceDetails } from "./WorkspaceDetails";
import { WorkspaceList } from "./WorkspaceList";
import { useSelector } from "react-redux";
import { DynamicIcon } from "lucide-react/dynamic";
import CreateWorkspaceSection from "./CreateWorkspaceSection";

export default function CreateWorkflowButton() {
  const {
    isOpen,
    setIsOpen,
    isCreatingWorkflow,
    workflowName,
    setWorkflowName,
    handleCreateWorkflow,
  } = useWorkflow();

  const defaultTemplates = useSelector((state) => state.team.defaultTemplate);
  const isDefaultTemplatesInitializing = useSelector(
    (state) => state.team.isDefaultTemplatesInitializing
  );

  const [allWorkspace, setAllWorkspace] = useState([]);
  const [categories, setCategories] = useState([
    {
      name: "New Workspace",
    },
  ]);

  const [step, setStep] = useState(1);

  const [selectedWorkspace, setSelectedWorkspace] = useState({
    id: "blank",
    name: "Blank Workspace",
    category: "New Workspace",
    tags: ["Workspace", "Blank"],
    iconId: "layout-template",
    description: "Start with a clean slate, no pre-built templates.",
    author: "Team Deforge",
  });

  const onClose = () => {
    setIsOpen(false);
    setStep(1);
  };

  useEffect(() => {
    if (defaultTemplates) {
      setAllWorkspace([
        {
          id: "blank",
          name: "Blank Workspace",
          category: "New Workspace",
          tags: ["Workspace", "Blank"],
          iconId: "layout-template",
          description: "Start with a clean slate, no pre-built templates.",
          author: "Team Deforge",
        },
        ...defaultTemplates,
      ]);

      const allCategories = [
        {
          name: "New Workspace",
        },
        ...defaultTemplates.map((t) => {
          return {
            name: t.category,
          };
        }),
      ];

      const uniqueCategories = [...new Set(allCategories.map((c) => c.name))];

      setCategories(
        uniqueCategories.map((c) => {
          return {
            name: c,
          };
        })
      );
    }
  }, [defaultTemplates]);

  return (
    <>
      <Button
        variant="outline"
        size="md"
        className="bg-black/80 rounded-lg text-background text-xs dark:bg-background dark:text-black"
        onPress={() => {
          setIsOpen(true);
        }}
        isDisabled={isDefaultTemplatesInitializing}
      >
        <Plus size={16} />
        New Agent
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background dark:bg-dark dark:border-background p-1 rounded-lg"
        onClose={onClose}
        size={step === 1 ? "5xl" : "md"}
        closeButton={<div></div>}
        isDismissable={!isCreatingWorkflow}
        isKeyboardDismissDisabled={isCreatingWorkflow}
        hideCloseButton={isCreatingWorkflow}
      >
        <ModalContent className="p-0">
          <ModalHeader className="p-4 flex-col">
            <h3 className="text-lg font-bold dark:text-background">
              {step === 1 ? "Choose a Template" : "Create Workspace"}
            </h3>
            <p className="text-xs opacity-70 font-normal text-black dark:text-background">
              {step === 1
                ? "Select a template to get started"
                : "Enter a name for your workspace"}
            </p>
          </ModalHeader>
          <ModalBody className="p-0 bg-background dark:bg-dark border-y dark:border-background border-black">
            {step === 1 ? (
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
                      {categories.map((category, index) => (
                        <div
                          key={index}
                          className="gap-2 text-black dark:text-background"
                        >
                          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Terminal size={14} />
                            {category.name}
                          </h3>
                          <WorkspaceList
                            workspaces={allWorkspace?.filter(
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
            ) : (
              <CreateWorkspaceSection
                workspace={selectedWorkspace}
                workspaceName={workflowName}
                setWorkspaceName={setWorkflowName}
              />
            )}
          </ModalBody>
          <ModalFooter className=" flex w-full gap-2 px-4">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => {
                if (step === 1) {
                  onClose();
                } else {
                  setStep(1);
                }
              }}
              isDisabled={isCreatingWorkflow}
            >
              {step === 2 ? "Back" : "Cancel"}
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => {
                if (step === 1) {
                  setStep(2);
                } else {
                  handleCreateWorkflow(selectedWorkspace.id);
                }
              }}
              isDisabled={
                isCreatingWorkflow ||
                (step === 1 ? !selectedWorkspace : !workflowName)
              }
            >
              {isCreatingWorkflow ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : step === 1 ? (
                "Use This Template"
              ) : (
                "Create"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
