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
import {
  Check,
  FileBox,
  FileCode2,
  Loader2,
  Plus,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { WorkspaceDetails } from "./WorkspaceDetails";
import { WorkspaceList } from "./WorkspaceList";
import { useSelector } from "react-redux";
import CreateWorkspaceSection from "./CreateWorkspaceSection";
import { cn } from "@/lib/utils";

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
  const [categories, setCategories] = useState([]);

  const [step, setStep] = useState(1);

  const [selectedWorkspace, setSelectedWorkspace] = useState();
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (
      isCreatingWorkflow ||
      (step === 1
        ? !selectedType
        : step === 2
        ? !selectedWorkspace
        : !workflowName)
    ) {
      return;
    }

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Enter") {
        if (step === 1) {
          if (selectedType === "forms") {
            setSelectedWorkspace(null);
            setStep(2);
          } else {
            setSelectedWorkspace({
              id: "blank",
              name: "Blank Workspace",
              category: "New Workspace",
              tags: ["Workspace", "Blank"],
              iconId: "layout-template",
              description: "Start with a clean slate, no pre-built templates.",
              author: "Team Deforge",
            });
            setStep(3);
          }
        } else if (step === 2) {
          setStep(3);
        } else {
          handleCreateWorkflow(
            selectedWorkspace.id,
            selectedWorkspace.id === "blank" ? "editor" : "form"
          );
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen, step, selectedType, selectedWorkspace, workflowName]);

  const onClose = () => {
    setIsOpen(false);
    setStep(1);
    setSelectedWorkspace(null);
    setWorkflowName("");
  };

  useEffect(() => {
    if (defaultTemplates) {
      setAllWorkspace([...defaultTemplates]);

      const allCategories = [
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
        className="bg-black/80 rounded-lg text-background text-xs h-9 dark:bg-background dark:text-black"
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
        size={step === 1 ? "2xl" : step === 2 ? "5xl" : "md"}
        closeButton={<div></div>}
        isDismissable={!isCreatingWorkflow}
        isKeyboardDismissDisabled={isCreatingWorkflow}
        hideCloseButton={isCreatingWorkflow}
        onSubmit={() => {
          if (step === 1) {
            if (selectedType === "forms") {
              setSelectedWorkspace(null);
              setStep(2);
            } else {
              setSelectedWorkspace({
                id: "blank",
                name: "Blank Workspace",
                category: "New Workspace",
                tags: ["Workspace", "Blank"],
                iconId: "layout-template",
                description:
                  "Start with a clean slate, no pre-built templates.",
                author: "Team Deforge",
              });
              setStep(3);
            }
          } else if (step === 2) {
            setStep(3);
          } else {
            handleCreateWorkflow(
              selectedWorkspace.id,
              selectedWorkspace.id === "blank" ? "editor" : "form"
            );
          }
        }}
      >
        <ModalContent className="p-0">
          <ModalHeader className="p-4 flex-col">
            <h3 className="text-lg font-bold dark:text-background">
              {step === 1
                ? "Select a type"
                : step === 2
                ? "Choose a form"
                : "Create Workspace"}
            </h3>
            <p className="text-xs opacity-70 font-normal text-black dark:text-background">
              {step === 1
                ? "Select a type of agent to get started"
                : step === 2
                ? "Select a form to get started"
                : "Enter a name for your workspace"}
            </p>
          </ModalHeader>
          <ModalBody className="p-0 bg-background dark:bg-dark border-y dark:border-background border-black">
            {step === 1 ? (
              <>
                <div className="flex h-[300px] rounded-none overflow-hidden p-4 gap-4">
                  <Card
                    className={cn(
                      "w-[calc(50%-0.5rem)] shadow-none rounded-lg border-black/80 dark:border-white/80 border hover:cursor-pointer bg-black/5 relative",
                      selectedType === "forms" &&
                        "border-primary dark:border-primary"
                    )}
                    isPressable
                    isHoverable
                    onPress={() => {
                      setSelectedType("forms");
                    }}
                  >
                    {selectedType === "forms" && (
                      <div className="p-2 rounded-full absolute top-2 right-2 bg-black/5 dark:bg-white/5">
                        <Check className="w-4 h-4 text-black dark:text-background" />
                      </div>
                    )}

                    <CardBody className="p-4">
                      <h2 className="text-4xl font-semibold text-black dark:text-background mt-2">
                        Forms
                      </h2>
                      <p className="text-sm opacity-70 text-black dark:text-background">
                        Forms are pre-built AI agents that are ready to be
                        deployed by you. Fill in the form and get started.
                      </p>
                    </CardBody>

                    <FileCode2 className="absolute -bottom-5 -right-0 w-36 h-36 text-black dark:text-background opacity-15" />
                  </Card>

                  <Card
                    className={cn(
                      "w-[calc(50%-0.5rem)] shadow-none rounded-lg border-black/80 dark:border-white/80 hover:cursor-pointer border relative bg-black/5",
                      selectedType === "blank" &&
                        "border-primary dark:border-primary"
                    )}
                    isPressable
                    isHoverable
                    onPress={() => {
                      setSelectedType("blank");
                    }}
                  >
                    {selectedType === "blank" && (
                      <div className="p-2 rounded-full absolute top-2 right-2 bg-black/5 dark:bg-white/5">
                        <Check className="w-4 h-4 text-black dark:text-background" />
                      </div>
                    )}

                    <CardBody className="p-4">
                      <h2 className="text-4xl font-semibold text-black dark:text-background mt-2">
                        Blank
                      </h2>
                      <p className="text-sm opacity-70 text-black dark:text-background">
                        Start with a blank workspace. Create, connect, and
                        deploy powerful AI agents with our intuitive node-based
                        interface.
                      </p>
                    </CardBody>

                    <FileBox className="absolute -bottom-5 -right-0 w-36 h-36 text-black dark:text-background opacity-15" />
                  </Card>
                </div>
              </>
            ) : step === 2 ? (
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
                isCreatingWorkflow={isCreatingWorkflow}
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
                  if (selectedType === "forms") {
                    setSelectedWorkspace(null);
                    setStep(2);
                  } else {
                    setSelectedWorkspace({
                      id: "blank",
                      name: "Blank Workspace",
                      category: "New Workspace",
                      tags: ["Workspace", "Blank"],
                      iconId: "layout-template",
                      description:
                        "Start with a clean slate, no pre-built templates.",
                      author: "Team Deforge",
                    });
                    setStep(3);
                  }
                } else if (step === 2) {
                  setStep(3);
                } else {
                  handleCreateWorkflow(
                    selectedWorkspace.id,
                    selectedWorkspace.id === "blank" ? "editor" : "form"
                  );
                }
              }}
              isDisabled={
                isCreatingWorkflow ||
                (step === 1
                  ? !selectedType
                  : step === 2
                  ? !selectedWorkspace
                  : !workflowName)
              }
            >
              {isCreatingWorkflow ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : step === 1 ? (
                "Select"
              ) : step === 2 ? (
                "Use this form"
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
