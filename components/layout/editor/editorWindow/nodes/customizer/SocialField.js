"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Link2, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import useConnectSocial from "@/hooks/useConnectSocial";

export default function SocialField({ field }) {
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
        <div className="text-sm font-medium flex">
          {field.name}

          {workflowSocial && workflowSocial[field.name.toLowerCase()] && (
            <div className="flex items-center ">
              <Link2 className="ml-2 w-3 h-3 mt-[1px]" />
              <div className="ml-1 text-[10px] text-black/50">Connected</div>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {workflowSocial && !workflowSocial[field.name.toLowerCase()] ? (
            <Button
              variant="outline"
              size="md"
              className="px-2 text-xs bg-black/80 text-background w-full"
              onPress={() => {
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
              className="px-2 text-xs bg-black/80 text-background w-full"
              onPress={() => {
                setIsOpen(true);
              }}
              isDisabled={workflow?.status === "LIVE"}
            >
              Disconnect
            </Button>
          )}
        </div>
        <div className="text-[10px] text-black/50">{field.desc}</div>
      </div>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1"
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
              <span className="text-black mx-1 font-semibold font-mono">
                {field.name}
              </span>
              ?
            </p>
          </ModalBody>
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-full rounded-full border border-black/80 p-7"
              onPress={() => setIsOpen(false)}
              isDisabled={isConnecting}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full p-7"
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
                <Loader2 className="animate-spin text-background" />
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
