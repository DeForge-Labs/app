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

export default function DuplicateButton({ workflow }) {
  const {
    isOpen,
    setIsOpen,
    workflowName,
    setWorkflowName,
    isDuplicatingWorkflow,
    handleDuplicateWorkflow,
  } = useDuplicateWorkflow();
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="border-black/80 border p-2 rounded-lg"
        onPress={() => setIsOpen(true)}
      >
        <Copy className="h-3 w-3" />
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isDuplicatingWorkflow}
        isKeyboardDismissDisabled={isDuplicatingWorkflow}
        hideCloseButton={isDuplicatingWorkflow}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col items-start">
            <h3 className="text-xl font-medium">Duplicate Workflow</h3>
            <p className="text-base mt-1 text-black/80 font-normal">
              All nodes and connections will be duplicated.
            </p>
          </ModalHeader>
          <ModalBody>
            <Input
              type="text"
              placeholder={workflow.name + " (Copy)"}
              className="border border-black/40 rounded-xl -mt-3 shadow-none"
              size="lg"
              variant="outline"
              startContent={<GitBranch className="text-black/40" />}
              isClearable
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              onClear={() => setWorkflowName("")}
              isDisabled={isDuplicatingWorkflow}
            />
          </ModalBody>
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-full rounded-full border border-black/80 p-7"
              onPress={() => setIsOpen(false)}
              isDisabled={isDuplicatingWorkflow}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full p-7"
              onPress={() => handleDuplicateWorkflow(workflow)}
              isDisabled={isDuplicatingWorkflow}
            >
              {isDuplicatingWorkflow ? (
                <Loader2 className="animate-spin text-background" />
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
