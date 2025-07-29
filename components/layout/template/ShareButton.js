"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { GitBranch } from "lucide-react";
import { toast } from "sonner";

export default function ShareButton() {
  const template = useSelector((state) => state.template.template);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="rounded-full h-12 text-xs text-black dark:text-background border border-black/50 w-36 dark:border-background p-5 px-10 bg-background dark:bg-dark"
        onPress={() => setIsOpen(true)}
      >
        Share
      </Button>
      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium dark:text-background">
              Share Template
            </h3>
          </ModalHeader>
          <ModalBody className="-mt-3 dark:text-background">
            <p className="text-sm text-black dark:text-background">
              Copy the link below to share this template with others.
            </p>
            <Input
              type="text"
              placeholder="Enter workspace name"
              className="border border-black/40 rounded-lg -mt- shadow-none dark:border-background dark:text-background"
              size="lg"
              variant="outline"
              startContent={
                <GitBranch className="text-black/40 dark:text-background" />
              }
              value={`https://d4ge.xyz/${template.shortId}`}
              onChange={(e) => {}}
            />
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => {
                navigator.clipboard.writeText(
                  `https://d4ge.xyz/${template.shortId}`
                );
                toast("Link copied to clipboard");
              }}
            >
              Share
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
