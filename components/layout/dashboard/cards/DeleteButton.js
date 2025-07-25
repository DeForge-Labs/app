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
        className="border-black/80 border p-2 rounded-lg dark:bg-dark dark:border-background"
        onPress={() => setIsOpen(true)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isDeletingWorkflow}
        isKeyboardDismissDisabled={isDeletingWorkflow}
        hideCloseButton={isDeletingWorkflow}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium dark:text-background">
              Delete Workspace
            </h3>
          </ModalHeader>
          <ModalBody className="-mt-3 dark:text-background">
            <p>
              Are you sure you want to delete this workspace? All Nodes,
              Connections and Logs related to this workspace will also be
              deleted.
            </p>
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isDeletingWorkflow}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => handleDeleteWorkflow(workflowId)}
              isDisabled={isDeletingWorkflow}
            >
              {isDeletingWorkflow ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
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
