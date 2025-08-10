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

export default function CreditPurchaseModal({ isOpen, onClose, gumroadUrl }) {
  const handleBuyOnGumroad = () => {
    if (gumroadUrl) {
      window.open(gumroadUrl, '_blank');
    }
    onClose();
  };

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
            Purchase Credits
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
          <p className="mb-2">
            Click the button below to purchase credits on Gumroad.
          </p>
          <p className="text-sm opacity-70">
            Please confirm and finish the payment in the link opened via this button only, do not open gumroad separately, come back to this page and use the button again in case you have to close the new tab.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onPress={onClose}
            className="border border-black/50 dark:border-white/50 dark:text-gray-50"
          >
            Cancel
          </Button>
          <Button
            className="bg-primary text-white"
            onPress={handleBuyOnGumroad}
          >
            Buy on Gumroad
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
