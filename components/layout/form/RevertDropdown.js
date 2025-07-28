"use client";

import usePublishForm from "@/hooks/usePublishForm";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function RevertDropdown() {
  const { isOpen, setIsOpen, handlePublishForm, isPublishingForm } =
    usePublishForm();
  const workspace = useSelector((state) => state.workflow.workspace);

  return (
    <>
      <Dropdown className="border border-black/50 rounded-lg bg-background dark:bg-dark dark:border-background">
        <DropdownTrigger>
          <Button
            variant="icon"
            size="icon"
            className="px-2 min-h-9 bg-black/80 dark:bg-background gap-1 text-background text-sm rounded-md rounded-l-none -ml-1.5 dark:text-dark"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Dropdown menu" className="">
          <DropdownItem
            key="asForm"
            description="Switch to editor mode"
            className="dark:text-background data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/5"
            onPress={() => {
              setIsOpen(true);
            }}
          >
            Editor Mode
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isPublishingForm}
        isKeyboardDismissDisabled={isPublishingForm}
        hideCloseButton={isPublishingForm}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium dark:text-background">
              Switch to Editor Mode
            </h3>
          </ModalHeader>
          <ModalBody className="-mt-3 dark:text-background">
            <p>
              Are you sure you want to switch to editor mode? Your agent will be
              customizable in editor mode.
            </p>
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isPublishingForm}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => {
                handlePublishForm(workspace?.id, "WORKFLOW");
              }}
              isDisabled={isPublishingForm}
            >
              {isPublishingForm ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Switch"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
