"use client";

import { useDuplicateWorkflow } from "@/hooks/useDuplicateWorkflow";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";
import { GitBranch, Loader2 } from "lucide-react";
import { Copy } from "lucide-react";
import { useEffect } from "react";

export default function DuplicateButton({ workflow }) {
  const {
    isOpen,
    setIsOpen,
    workflowName,
    setWorkflowName,
    isDuplicatingWorkflow,
    handleDuplicateWorkflow,
  } = useDuplicateWorkflow();

  useEffect(() => {
    if (!isOpen) return;

    if (isDuplicatingWorkflow) return;

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }

      if (e.key === "Enter") {
        handleDuplicateWorkflow(workflow);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen, isDuplicatingWorkflow, handleDuplicateWorkflow, workflow]);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="border-black/80 border p-2 rounded-lg dark:border-background dark:text-background"
        onPress={() => setIsOpen(true)}
      >
        <Copy className="h-3 w-3" />
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isDuplicatingWorkflow}
        isKeyboardDismissDisabled={isDuplicatingWorkflow}
        hideCloseButton={isDuplicatingWorkflow}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col items-start">
            <h3 className="text-lg font-medium dark:text-background">
              Duplicate Workspace
            </h3>
            <p className="text-base mt-1 text-black/80 font-normal dark:text-background">
              Your workflow and form will be duplicated.
            </p>
          </ModalHeader>
          <ModalBody>
            <Input
              type="text"
              placeholder={workflow.name + " (Copy)"}
              className="border border-black/40 rounded-lg -mt-3 shadow-none dark:border-background dark:text-background"
              size="lg"
              variant="outline"
              startContent={
                <GitBranch className="text-black/40 dark:text-background" />
              }
              isClearable
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              onClear={() => setWorkflowName("")}
              isDisabled={isDuplicatingWorkflow}
            />
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isDuplicatingWorkflow}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => handleDuplicateWorkflow(workflow)}
              isDisabled={isDuplicatingWorkflow}
            >
              {isDuplicatingWorkflow ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Duplicate"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
