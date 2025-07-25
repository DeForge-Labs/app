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
import { Loader2, Rocket } from "lucide-react";
import useDeployWorkflow from "@/hooks/useDeployWorkflow";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function DeployButton({ className, showTooltip = true }) {
  const { isOpen, setIsOpen, isDeploying, handleDeployWorkflow } =
    useDeployWorkflow();
  const hasUnsavedChanges = useSelector(
    (state) => state.workflow.hasUnsavedChanges
  );
  return (
    <>
      {showTooltip && (
        <Tooltip
          className="bg-white border-black/50 border mb-3 rounded-lg shadow-none"
          content={
            <div className="p-2 text-xs">
              <p>Deploy workflow To Production</p>
            </div>
          }
        >
          <Button
            onPress={() => {
              if (!hasUnsavedChanges) {
                setIsOpen(true);
              } else {
                toast.info("Please save your changes before deploying");
              }
            }}
            variant="icon"
            className={cn(className)}
            size="icon"
          >
            <Rocket size={16} />
            Deploy
          </Button>
        </Tooltip>
      )}

      {!showTooltip && (
        <Button
          onPress={() => {
            if (!hasUnsavedChanges) {
              setIsOpen(true);
            } else {
              toast.info("Please save your changes before deploying");
            }
          }}
          variant="icon"
          className={cn(className)}
          size="icon"
        >
          <Rocket size={16} />
          Deploy
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:border-background dark:text-background dark:bg-dark"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isDeploying}
        isKeyboardDismissDisabled={isDeploying}
        hideCloseButton={isDeploying}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium">Deploy Workflow</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to deploy this workflow? Deployments can be
              updated and run from the Deployments tab.
            </p>
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isDeploying}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => handleDeployWorkflow()}
              isDisabled={isDeploying}
            >
              {isDeploying ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Deploy"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
