"use client";

import {
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import useFallbackWorkflow from "@/hooks/useFallbackWorkflow";

export default function FormRollbackButton({ className }) {
  const { isOpen, setIsOpen, isFallbacking, handleFallbackWorkflow } =
    useFallbackWorkflow();
  return (
    <>
      <Tooltip
        className="bg-white border-black/50 border mb-3 rounded-lg shadow-none"
        content={
          <div className="p-2 text-xs">
            <p>Revert to Testing Environment</p>
          </div>
        }
      >
        <Button
          onPress={() => {
            setIsOpen(true);
          }}
          variant="icon"
          className={cn(className)}
          size="icon"
        >
          Rollback
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:border-background dark:text-background dark:bg-dark"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isFallbacking}
        isKeyboardDismissDisabled={isFallbacking}
        hideCloseButton={isFallbacking}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium">Rollback Workflow</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to rollback this workflow? This will revert
              to the testing environment.
            </p>
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isFallbacking}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => handleFallbackWorkflow()}
              isDisabled={isFallbacking}
            >
              {isFallbacking ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Rollback"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
