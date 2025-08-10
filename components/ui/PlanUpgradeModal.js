"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

export default function PlanUpgradeModal({ isOpen, onClose, countdown }) {
  return (
    <Modal
      isOpen={isOpen}
      className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
      onClose={onClose}
      closeButton={<div></div>}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-medium dark:text-background">
            Redirecting to Gumroad
          </h3>
        </ModalHeader>
        <ModalBody className="-mt-3 dark:text-background">
          <p className="mb-2">
            Redirecting you to gumroad for checkout in {countdown} seconds...
          </p>
          <p className="text-sm opacity-70">
            Please confirm and finish the payment in the link opened via this redirect only, do not open gumroad separately, come back to this page and use the button again in case you have to close this redirection.
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
