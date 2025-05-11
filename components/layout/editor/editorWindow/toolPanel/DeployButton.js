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

export default function DeployButton() {
  const { isOpen, setIsOpen, isDeploying, handleDeployWorkflow } =
    useDeployWorkflow();
  const hasUnsavedChanges = useSelector(
    (state) => state.workflow.hasUnsavedChanges
  );
  return (
    <>
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
          className={cn(
            "w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-4 "
          )}
          size="icon"
        >
          <Rocket size={16} />
          Deploy
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isDeploying}
        isKeyboardDismissDisabled={isDeploying}
        hideCloseButton={isDeploying}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium">Deploy Workflow</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to deploy this workflow? Deployments can be
              updated and run from the Deployments tab.
            </p>
          </ModalBody>
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-full rounded-full border border-black/80 p-7"
              onPress={() => setIsOpen(false)}
              isDisabled={isDeploying}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full p-7"
              onPress={() => handleDeployWorkflow()}
              isDisabled={isDeploying}
            >
              {isDeploying ? (
                <Loader2 className="animate-spin text-background" />
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
