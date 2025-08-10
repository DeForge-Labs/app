"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { X } from "lucide-react";

export default function PlanDowngradeModal({ 
  isOpen, 
  onClose
}) {
  return (
    <Modal
      isOpen={isOpen}
      className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
      onClose={onClose}
      closeButton={<div></div>}
      isDismissable={true}
      isKeyboardDismissDisabled={false}
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <h3 className="text-lg font-medium dark:text-background">
            Subscription Cancellation
          </h3>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onPress={onClose}
            className="border border-black/50 dark:border-white/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </ModalHeader>
        <ModalBody className="-mt-3 dark:text-background">
          <p className="mb-4">
            We are sorry that we cannot handle subscription cancellation from our platform.
          </p>
          <p className="mb-4">
            You will have to cancel your subscription directly from Gumroad.
          </p>
          <p>
            Here's an article from the Gumroad help center to guide you:{" "}
            <a 
              href="https://gumroad.com/help/article/192-how-do-i-cancel-my-membership" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              How do I cancel my membership?
            </a>
          </p>
        </ModalBody>
        <ModalFooter className="-mt-1 flex w-full gap-2">
          <Button
            className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
            onPress={onClose}
          >
            Understood
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
