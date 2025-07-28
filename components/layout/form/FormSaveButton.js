"use client";

import useSaveWorkflow from "@/hooks/useSaveWorkflow";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@heroui/react";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function FormSaveButton() {
  const hasUnsavedChanges = useSelector(
    (state) => state.workflow.hasUnsavedChanges
  );
  const hasUnsavedChangesForm = useSelector(
    (state) => state.form.hasUnsavedChanges
  );
  const { isOpen, setIsOpen, isSavingWorkflow, handleSaveWorkflow } =
    useSaveWorkflow();

  const isWorkflowInitializing = useSelector(
    (state) => state.workflow.isWorkflowInitializing
  );

  const workflow = useSelector((state) => state.workflow.workflow);

  return (
    <>
      <Tooltip
        className="bg-white border-black/50 border mb-3 rounded-lg shadow-none"
        content={
          <div className="p-2 text-xs">
            <p>Unsaved Changes, Click to save</p>
          </div>
        }
      >
        <Button
          variant="icon"
          size="icon"
          className="px-4 min-h-9 bg-black/80 dark:bg-background text-background text-sm rounded-md dark:text-dark rounded-r-none"
          isDisabled={
            !(hasUnsavedChanges || hasUnsavedChangesForm) ||
            isWorkflowInitializing ||
            workflow?.status === "LIVE"
          }
          onPress={() => {
            setIsOpen(true);
          }}
        >
          Save
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 rounded-lg dark:border-background dark:bg-dark dark:text-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isSavingWorkflow}
        isKeyboardDismissDisabled={isSavingWorkflow}
        hideCloseButton={isSavingWorkflow}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium">Save Workspace</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to save this workspace? Your Form Inputs
              will be saved.
            </p>
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isSavingWorkflow}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => handleSaveWorkflow()}
              isDisabled={isSavingWorkflow}
            >
              {isSavingWorkflow ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
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
