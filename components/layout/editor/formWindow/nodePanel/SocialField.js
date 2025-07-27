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
import { useDispatch } from "react-redux";
import { setIsPreview, setIsSelector } from "@/redux/slice/formSlice";

export default function SocialField({ field, nodeId }) {
  const dispatch = useDispatch();
  const {
    handleConnectSocial,
    isOpen,
    setIsOpen,
    isConnecting,
    handleDisconnectSocial,
  } = useConnectSocial();
  const workflowSocial = useSelector((state) => state.workflow.workflowSocial);
  const workflow = useSelector((state) => state.workflow.workflow);

  const components = useSelector((state) => state.form.components);

  const handleDragStart = (e) => {
    dispatch(setIsSelector(false));
    dispatch(setIsPreview(false));

    const isComponentPresent =
      components &&
      components.find(
        (component) => component.id === `${nodeId}|${field.name}`
      );
    if (isComponentPresent) {
      toast("Field is already present, can't add again");
      return;
    }

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: field.type,
        id: `${nodeId}|${field.name}`,
        name: field.name,
        component: "component",
      })
    );
  };

  return (
    <>
      <div
        key={field.name}
        onDragStart={(e) => handleDragStart(e)}
        draggable
        className="space-y-2 p-3 rounded-lg border border-black/50 dark:border-background dark:text-background bg-background dark:bg-zinc-900"
      >
        <div className="text-sm font-medium flex items-center gap-2">
          {field.name}

          <div className="text-[10px] text-blue-500 flex items-center gap-1 rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full"> </div>
            Social
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {workflowSocial && !workflowSocial[field.name.toLowerCase()] ? (
            <Button
              variant="outline"
              size="md"
              className="px-2 text-xs bg-black/80 text-background w-full dark:bg-background dark:text-black"
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
              className="px-2 text-xs bg-black/80 text-background w-full dark:bg-background dark:text-black"
              onPress={() => {
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
        className="border border-black bg-background p-1 dark:border-background dark:text-background dark:bg-dark"
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
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-full rounded-full border border-black/80 p-7 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isConnecting}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full p-7 dark:bg-background dark:text-black"
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
