"use client";

import useSaveEnv from "@/hooks/useSaveEnv";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Input } from "@heroui/react";
import { Save, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function EnvField({ field }) {
  const { handleSaveEnv, isOpen, setIsOpen, isSavingEnv } = useSaveEnv();
  const [value, setValue] = useState(field.value);
  const workflowEnv = useSelector((state) => state.workflow.workflowEnv);
  const [defaultValue, setDefaultValue] = useState(field.defaultValue);
  const workflow = useSelector((state) => state.workflow.workflow);

  useEffect(() => {
    if (workflowEnv) {
      setDefaultValue(workflowEnv[field.name] ? workflowEnv[field.name] : "");
    }
  }, [workflowEnv]);
  return (
    <>
      <div key={field.name} className="space-y-2">
        <div className="text-sm font-medium">{field.name}</div>
        <div className="flex gap-2 items-center">
          <Input
            id={field.name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 border border-black/50 rounded-md dark:border-background dark:text-background"
            variant="outline"
            placeholder={defaultValue}
          />
          <Button
            size="icon"
            variant="icon"
            className="p-3 rounded-md text-xs bg-black/80 text-background h-full dark:bg-background dark:text-black"
            onPress={() => {
              setIsOpen(true);
            }}
            isDisabled={!value || workflow?.status === "LIVE"}
          >
            <Save className="h-4 w-4" />
          </Button>
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
        isDismissable={!isSavingEnv}
        isKeyboardDismissDisabled={isSavingEnv}
        hideCloseButton={isSavingEnv}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium">Save Environment Variable</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to save this environment variable
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
              isDisabled={isSavingEnv}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full p-7 dark:bg-background dark:text-black"
              onPress={() => handleSaveEnv(field.name, value, setValue)}
              isDisabled={isSavingEnv || !value}
            >
              {isSavingEnv ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Save"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
