"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import LoginForm from "../onboard/LoginForm";
import Image from "next/image";

export default function GetStartedButton({ isNavbar = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onOpenChange = (open) => {
    // Only allow closing if not in loading state
    if (!isLoading) {
      setIsOpen(open);
    }
  };

  return (
    <>
      {!isNavbar && (
        <Button
          variant="outline"
          size="md"
          className="bg-black/80 h-9 rounded-lg text-background text-xs dark:bg-background dark:text-black"
          onPress={() => setIsOpen(true)}
        >
          Get Started
        </Button>
      )}

      {isNavbar && (
        <Button
          className="bg-black/80 h-12 rounded-full text-xs text-background dark:bg-background dark:text-black p-5 px-10 w-36 z-10"
          onPress={() => {
            setIsOpen(true);
          }}
        >
          Sign In
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-5 pb-8 rounded-3xl max-w-md dark:bg-dark dark:border-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isLoading}
        isKeyboardDismissDisabled={isLoading}
        hideCloseButton={isLoading}
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center space-x-2">
              <Image
                src="/logo/logo-black.svg"
                alt="Logo"
                width={27}
                height={27}
                className="dark:invert"
              />
              <span className="font-bold inline-block text-4xl dark:text-background">
                Deforge
              </span>
            </div>
          </ModalHeader>
          <ModalBody className="-mt-5 dark:text-background">
            <LoginForm onLoadingChange={setIsLoading} embedded />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
