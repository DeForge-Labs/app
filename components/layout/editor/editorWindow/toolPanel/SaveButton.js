"use client";

import useSaveWorkflow from "@/hooks/useSaveWorkflow";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Loader2, Save } from "lucide-react";
import { useSelector } from "react-redux";

export default function SaveButton() {
  const hasUnsavedChanges = useSelector(
    (state) => state.workflow.hasUnsavedChanges
  );
  const { isOpen, setIsOpen, isSavingWorkflow, handleSaveWorkflow } =
    useSaveWorkflow();

  const isWorkflowInitializing = useSelector(
    (state) => state.workflow.isWorkflowInitializing
  );

  const workflow = useSelector((state) => state.workflow.workflow);

  return (
    <>
      <Button
        variant="icon"
        size="icon"
        className="w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-4 "
        isDisabled={
          !hasUnsavedChanges ||
          isWorkflowInitializing ||
          workflow?.status === "LIVE"
        }
        onPress={() => {
          setIsOpen(true);
        }}
      >
        <Save className="h-4 w-4" /> Save
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isSavingWorkflow}
        isKeyboardDismissDisabled={isSavingWorkflow}
        hideCloseButton={isSavingWorkflow}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium">Save Workflow</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to save this workflow? All Nodes and
              Connections will be saved.
            </p>
          </ModalBody>
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-full rounded-full border border-black/80 p-7"
              onPress={() => setIsOpen(false)}
              isDisabled={isSavingWorkflow}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full p-7"
              onPress={() => handleSaveWorkflow()}
              isDisabled={isSavingWorkflow}
            >
              {isSavingWorkflow ? (
                <Loader2 className="animate-spin text-background" />
              ) : (
                "Save"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
