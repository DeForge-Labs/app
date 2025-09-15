"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Undo2, Loader2 } from "lucide-react";
import useRevertTemplate from "@/hooks/useRevertTemplate";
import { useEffect } from "react";

export default function RevertButton({ templateId }) {
  const { isOpen, setIsOpen, isRevertingTemplate, handleRevertTemplate } =
    useRevertTemplate();

  useEffect(() => {
    if (!isOpen) return;

    if (isRevertingTemplate) return;

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }

      if (e.key === "Enter") {
        handleRevertTemplate(templateId);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen, isRevertingTemplate, handleRevertTemplate, templateId]);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="border-black/80 border p-2 rounded-lg dark:bg-dark dark:border-background"
        onPress={() => setIsOpen(true)}
      >
        <Undo2 className="h-3 w-3" />
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isRevertingTemplate}
        isKeyboardDismissDisabled={isRevertingTemplate}
        hideCloseButton={isRevertingTemplate}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium dark:text-background">
              Revert Template
            </h3>
          </ModalHeader>
          <ModalBody className="-mt-3 dark:text-background">
            <p>
              Are you sure you want to revert this template? This template will
              be unpublished and a new workspace will be created.
            </p>
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isRevertingTemplate}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => handleRevertTemplate(templateId)}
              isDisabled={isRevertingTemplate}
            >
              {isRevertingTemplate ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Revert"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
