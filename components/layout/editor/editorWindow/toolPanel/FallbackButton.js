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
import { FlaskConical, Loader2 } from "lucide-react";
import useFallbackWorkflow from "@/hooks/useFallbackWorkflow";

export default function FallbackButton() {
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
          className={cn(
            "w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-4 "
          )}
          size="icon"
        >
          <FlaskConical size={16} />
          Rollback
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isFallbacking}
        isKeyboardDismissDisabled={isFallbacking}
        hideCloseButton={isFallbacking}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium">Rollback Workflow</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to rollback this workflow? Nodes and
              connections can be updated and run from the Deployments tab.
            </p>
          </ModalBody>
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-full rounded-full border border-black/80 p-7"
              onPress={() => setIsOpen(false)}
              isDisabled={isFallbacking}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full p-7"
              onPress={() => handleFallbackWorkflow()}
              isDisabled={isFallbacking}
            >
              {isFallbacking ? (
                <Loader2 className="animate-spin text-background" />
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
