"use client";

import useCloneTemplate from "@/hooks/useCloneTemplate";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import LoginForm from "../onboard/LoginForm";
import Image from "next/image";
import { toast } from "sonner";
import { useEffect } from "react";

export default function UseButton() {
  const { isOpen, setIsOpen, handleCloneTemplate, isCloningTemplate } =
    useCloneTemplate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const selectedTeam = useSelector((state) => state.template.selectedTeam);

  useEffect(() => {
    if (!isOpen) return;

    if (isCloningTemplate) return;

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }

      if (e.key === "Enter") {
        handleCloneTemplate(selectedTeam);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen, handleCloneTemplate, selectedTeam, isCloningTemplate]);

  return (
    <>
      <Button
        className="bg-black/80 h-12 rounded-full text-xs text-background dark:bg-background dark:text-black p-5 px-10 w-36 z-10"
        onPress={() => {
          if (!selectedTeam) {
            toast.error("Please select a team");
            return;
          }

          if (!user) {
            setIsLoginModalOpen(true);
          } else {
            setIsOpen(true);
          }
        }}
      >
        Edit Agent
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isCloningTemplate}
        isKeyboardDismissDisabled={isCloningTemplate}
        hideCloseButton={isCloningTemplate}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium dark:text-background">
              Edit Agent
            </h3>
          </ModalHeader>
          <ModalBody className="-mt-3 dark:text-background">
            <p>Customise this form to your needs and deploy your own agent ?</p>
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isCloningTemplate}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => handleCloneTemplate(selectedTeam)}
              isDisabled={isCloningTemplate}
            >
              {isCloningTemplate ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Edit"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isLoginModalOpen}
        className="border border-black bg-background p-5 pb-8 rounded-3xl max-w-md dark:bg-dark dark:border-background"
        onClose={() => setIsLoginModalOpen(false)}
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
