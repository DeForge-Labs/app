"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Loader2, Trash2 } from "lucide-react";
import useDeleteWorkflow from "@/hooks/useDeleteWorkflow";

export default function DeleteButton({ workflowId }) {
  const { isOpen, setIsOpen, handleDeleteWorkflow, isDeletingWorkflow } =
    useDeleteWorkflow();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="border-black/80 border p-2 rounded-lg"
        onPress={() => setIsOpen(true)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isDeletingWorkflow}
        isKeyboardDismissDisabled={isDeletingWorkflow}
        hideCloseButton={isDeletingWorkflow}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium">Delete Workflow</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to delete this workflow? All Nodes,
              Connections and Logs related to this workflow will also be
              deleted.
            </p>
          </ModalBody>
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-full rounded-full border border-black/80 p-7"
              onPress={() => setIsOpen(false)}
              isDisabled={isDeletingWorkflow}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full p-7"
              onPress={() => handleDeleteWorkflow(workflowId)}
              isDisabled={isDeletingWorkflow}
            >
              {isDeletingWorkflow ? (
                <Loader2 className="animate-spin text-background" />
              ) : (
                "Delete"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
