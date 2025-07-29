"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import useConnectSocial from "@/hooks/useConnectSocial";

export default function SocialField({ field, isTemplate = false }) {
  const {
    handleConnectSocial,
    isOpen,
    setIsOpen,
    isConnecting,
    handleDisconnectSocial,
  } = useConnectSocial();
  const workflowSocial = useSelector((state) => state.workflow.workflowSocial);
  const workflow = useSelector((state) => state.workflow.workflow);

  return (
    <>
      <div key={field.name} className="space-y-2">
        <div className="text-sm font-medium flex items-center gap-2 dark:text-background">
          {field.name}

          <div className="text-[10px] text-blue-500 flex items-center gap-1 rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full"> </div>
            Social
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {isTemplate ||
          (workflowSocial && !workflowSocial[field.name.toLowerCase()]) ? (
            <Button
              variant="outline"
              size="md"
              className="px-2 text-xs bg-black/80 text-background w-full dark:bg-background dark:text-black"
              onPress={() => {
                if (isTemplate) {
                  return;
                }
                setIsOpen(true);
              }}
              isDisabled={workflow?.status === "LIVE"}
            >
              Connect
            </Button>
          ) : (
            <Button
              variant="outline"
              size="md"
              className="px-2 text-xs bg-black/80 text-background w-full dark:bg-background dark:text-black"
              onPress={() => {
                if (isTemplate) {
                  return;
                }
                setIsOpen(true);
              }}
              isDisabled={workflow?.status === "LIVE"}
            >
              Disconnect
            </Button>
          )}
        </div>
        <div className="text-[10px] text-black/50 dark:text-background">
          {field.desc}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 rounded-lg dark:border-background dark:bg-dark dark:text-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isConnecting}
        isKeyboardDismissDisabled={isConnecting}
        hideCloseButton={isConnecting}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium">
              {workflowSocial && workflowSocial[field.name.toLowerCase()]
                ? "Disconnect Social"
                : "Connect Social"}
            </h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to{" "}
              {workflowSocial && workflowSocial[field.name.toLowerCase()]
                ? "disconnect"
                : "connect"}{" "}
              this social account
              <span className="text-black mx-1 font-semibold font-mono dark:text-background">
                {field.name}
              </span>
              ?
            </p>
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isConnecting}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => {
                if (
                  workflowSocial &&
                  workflowSocial[field.name.toLowerCase()]
                ) {
                  handleDisconnectSocial(field.name.toLowerCase());
                } else {
                  handleConnectSocial(field.name.toLowerCase());
                }
              }}
              isDisabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : workflowSocial && workflowSocial[field.name.toLowerCase()] ? (
                "Disconnect"
              ) : (
                "Connect"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
