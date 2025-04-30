"use client";

import useWorkflow from "@/hooks/useCreateWorkflow";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";
import { GitBranch, Loader2, Plus } from "lucide-react";

export default function CreateWorkflowButton() {
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
        size="md"
        className="bg-black/80 rounded-lg text-background text-xs"
        onPress={() => {
          setIsOpen(true);
        }}
      >
        <Plus size={16} />
        Create New Workflow
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isCreatingWorkflow}
        isKeyboardDismissDisabled={isCreatingWorkflow}
        hideCloseButton={isCreatingWorkflow}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium">Create New Workflow</h3>
          </ModalHeader>
          <ModalBody>
            <Input
              type="text"
              placeholder="Enter workflow name"
              className="border border-black/40 rounded-xl -mt-3 shadow-none"
              size="lg"
              variant="outline"
              startContent={<GitBranch className="text-black/40" />}
              isClearable
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              onClear={() => setWorkflowName("")}
            />
          </ModalBody>
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-full rounded-full border border-black/80 p-7"
              onPress={() => setIsOpen(false)}
              isDisabled={isCreatingWorkflow}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full p-7"
              onPress={handleCreateWorkflow}
              isDisabled={isCreatingWorkflow || !workflowName}
            >
              {isCreatingWorkflow ? (
                <Loader2 className="animate-spin text-background" />
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
