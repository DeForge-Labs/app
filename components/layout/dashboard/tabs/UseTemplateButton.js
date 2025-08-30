"use client";

import useWorkflow from "@/hooks/useCreateWorkflow";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Loader2, Plus } from "lucide-react";
import CreateWorkspaceSection from "../CreateWorkspaceSection";

export default function UseTemplateButton({ template }) {
  const {
    isOpen,
    setIsOpen,
    isCreatingWorkflow,
    workflowName,
    setWorkflowName,
    handleCreateWorkflow,
  } = useWorkflow();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="bg-black/80 rounded-lg text-background text-xs dark:bg-background dark:text-black"
        onPress={() => {
          setIsOpen(true);
        }}
      >
        <Plus size={16} />
        Use Form
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background dark:bg-dark dark:border-background p-1 rounded-lg"
        onClose={() => {
          setIsOpen(false);
        }}
        size="md"
        closeButton={<div></div>}
        isDismissable={!isCreatingWorkflow}
        isKeyboardDismissDisabled={isCreatingWorkflow}
        hideCloseButton={isCreatingWorkflow}
      >
        <ModalContent className="p-0">
          <ModalHeader className="p-4 flex-col">
            <h3 className="text-lg font-bold dark:text-background">
              Create Workspace
            </h3>
            <p className="text-xs opacity-70 font-normal text-black dark:text-background">
              Enter a name for your workspace
            </p>
          </ModalHeader>
          <ModalBody className="p-0 bg-background dark:bg-dark border-y dark:border-background border-black">
            <CreateWorkspaceSection
              workspace={template}
              workspaceName={workflowName}
              setWorkspaceName={setWorkflowName}
              isCreatingWorkflow={isCreatingWorkflow}
            />
          </ModalBody>
          <ModalFooter className=" flex w-full gap-2 px-4">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => {
                setIsOpen(false);
              }}
              isDisabled={isCreatingWorkflow}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => {
                handleCreateWorkflow(template.id, "form");
              }}
              isDisabled={isCreatingWorkflow || !workflowName}
            >
              {isCreatingWorkflow ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
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
