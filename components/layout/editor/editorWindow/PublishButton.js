"use client";

import usePublishForm from "@/hooks/usePublishForm";
import usePublishTemplate from "@/hooks/usePublishTemplate";
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Textarea,
  Chip,
  Checkbox,
} from "@heroui/react";
import { AlertCircle, ChevronDown, GitBranch, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const icons = [
  "layout-template",
  "zap",
  "atom",
  "calendar",
  "chart-line",
  "clipboard-list",
  "boxes",
  "database",
];

export default function PublishButton() {
  const { isOpen, setIsOpen, handlePublishForm, isPublishingForm } =
    usePublishForm();
  const workspace = useSelector((state) => state.workflow.workspace);
  const components = useSelector((state) => state.form.components);
  const [step, setStep] = useState(1);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const {
    isTemplateOpen,
    setIsTemplateOpen,
    handlePublishTemplate,
    isPublishingTemplate,
  } = usePublishTemplate();
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("LISTED");
  const [author, setAuthor] = useState("");

  const isFormEmpty = components?.length === 0;

  useEffect(() => {
    if (!isTemplateOpen) return;

    if (
      isPublishingTemplate ||
      !name ||
      !description ||
      !category ||
      !author ||
      tags.length === 0 ||
      !selectedIcon
    )
      return;

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setIsTemplateOpen(false);
      }

      if (e.key === "Enter") {
        if (step === 1) {
          return;
        }
        handlePublishTemplate(
          name,
          description,
          category,
          tags,
          selectedIcon,
          visibility,
          author,
          workspace?.id,
          workspace?.teamId
        );
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [
    isOpen,
    isPublishingTemplate,
    handlePublishTemplate,
    workspace?.id,
    name,
    description,
    category,
    author,
    tags,
    selectedIcon,
  ]);

  useEffect(() => {
    if (!isOpen) return;

    if (isPublishingForm) return;

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }

      if (e.key === "Enter") {
        handlePublishForm(workspace?.id, "FORM");
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen, isPublishingForm, handlePublishForm, workspace?.id]);

  return (
    <>
      <Dropdown className="border border-black/50 rounded-lg bg-background dark:bg-dark dark:border-background">
        <DropdownTrigger>
          <Button
            variant="outline"
            size="icon"
            className="px-4 min-h-9 bg-black/80 dark:bg-background gap-1 text-background text-sm rounded-md dark:text-dark"
          >
            Publish
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Dropdown menu" className="">
          <DropdownItem
            key="asForm"
            description="Access your Agent as form"
            className="dark:text-background data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/5"
            onPress={() => {
              if (isFormEmpty) {
                toast.error("Form is empty");
                return;
              }
              setIsOpen(true);
            }}
          >
            Form
          </DropdownItem>
          <DropdownItem
            key="asTemplate"
            description="Share your Agent to others"
            className="dark:text-background data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/5"
            onPress={() => {
              if (isFormEmpty) {
                toast.error("Form is empty");
                return;
              }
              setIsTemplateOpen(true);
            }}
          >
            Template
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
              Publish Form
            </h3>
          </ModalHeader>
          <ModalBody className="-mt-3 dark:text-background">
            <p>
              Are you sure you want to publish this form? Your agent will be
              accessible as form.
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
                handlePublishForm(workspace?.id, "FORM");
              }}
              isDisabled={isPublishingForm}
            >
              {isPublishingForm ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Publish"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isTemplateOpen}
        className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
        onClose={() => {
          setIsTemplateOpen(false);
          setStep(1);
        }}
        closeButton={<div></div>}
        isDismissable={!isPublishingTemplate}
        isKeyboardDismissDisabled={isPublishingTemplate}
        hideCloseButton={isPublishingTemplate}
      >
        <ModalContent className="p-0">
          <ModalHeader className="p-4 flex-col">
            <h3 className="text-lg font-bold dark:text-background">
              {step === 1 ? "Create Template" : "Publish Template"}
            </h3>
            <p className="text-xs opacity-70 font-normal text-black dark:text-background">
              {step === 1
                ? "Fill the form to create a template"
                : "Finalize your template"}
            </p>
          </ModalHeader>
          <ModalBody className="p-0 bg-background dark:bg-dark border-y dark:border-background border-black">
            {step === 1 ? (
              <div className="flex flex-col gap-2 p-4 rounded-none overflow-hidden">
                <div className="flex items-center justify-center">
                  <Popover placement="bottom">
                    <PopoverTrigger>
                      <Button
                        isIconOnly
                        variant="bordered"
                        className="aspect-square h-28 w-28 rounded-md bg-black/5 dark:bg-white/5 border border-black/50 dark:border-background  text-black dark:text-background"
                      >
                        {selectedIcon ? (
                          <DynamicIcon
                            name={selectedIcon}
                            width={32}
                            height={32}
                          />
                        ) : (
                          <DynamicIcon name="plus" width={32} height={32} />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-background dark:bg-dark border border-black/50 dark:border-background">
                      <div className="grid grid-cols-4 gap-2 p-2">
                        {icons.map((icon) => (
                          <Button
                            key={icon}
                            isIconOnly
                            variant={selectedIcon === icon ? "solid" : "light"}
                            color={
                              selectedIcon === icon ? "primary" : "default"
                            }
                            onPress={() => setSelectedIcon(icon)}
                          >
                            <DynamicIcon name={icon} width={24} height={24} />
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <Input
                  type="text"
                  label="Template Name"
                  placeholder="Epic Template"
                  className="border border-black/40 rounded-lg mt-2 shadow-none dark:border-background dark:text-background"
                  size="lg"
                  variant="outline"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  classNames={{
                    label: "text-xs mb-2",
                    inputWrapper: "",
                  }}
                  onClear={() => setName("")}
                  isClearable
                />

                <Textarea
                  label="Description"
                  placeholder="My awesome template can automate my daily tasks."
                  className="border border-black/40 rounded-lg mt-2 shadow-none dark:border-background dark:text-background"
                  size="lg"
                  variant="outline"
                  classNames={{
                    label: "text-xs",
                    inputWrapper: "",
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onClear={() => setDescription("")}
                  isClearable
                />

                <Input
                  type="text"
                  label="Category"
                  placeholder="Automation"
                  className="border border-black/40 rounded-lg mt-2 shadow-none dark:border-background dark:text-background"
                  size="lg"
                  variant="outline"
                  classNames={{
                    label: "text-xs mb-2",
                    inputWrapper: "",
                  }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onClear={() => setCategory("")}
                  isClearable
                />

                <Input
                  type="text"
                  label="Tags"
                  placeholder="AI, Agent, Automation"
                  className="border border-black/40 rounded-lg mt-2 shadow-none dark:border-background dark:text-background"
                  size="lg"
                  variant="outline"
                  classNames={{
                    label: "text-xs mb-2",
                    inputWrapper: "",
                  }}
                  isClearable
                  onChange={(e) => setCurrentTag(e.target.value)}
                  value={currentTag}
                  isDisabled={tags.length >= 3}
                  onKeyDown={(e) => {
                    if (
                      (e.key === " " || e.key === "Enter" || e.key === ",") &&
                      currentTag.trim() !== ""
                    ) {
                      if (tags.length < 3) {
                        setTags([...tags, currentTag.trim()]);
                        setCurrentTag("");
                      }
                      e.preventDefault();
                    }
                  }}
                />
                <div
                  className={cn(
                    "flex flex-wrap gap-2 mt-2",
                    tags.length === 0 && "hidden"
                  )}
                >
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      onClose={() => {
                        setTags(tags.filter((t) => tag !== t));
                      }}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>

                <Input
                  type="text"
                  label="Author"
                  placeholder="Team Fantastic"
                  className="border border-black/40 rounded-lg mt-2 shadow-none dark:border-background dark:text-background"
                  size="lg"
                  variant="outline"
                  classNames={{
                    label: "text-xs mb-2",
                    inputWrapper: "",
                  }}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  onClear={() => setAuthor("")}
                  isClearable
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-4 rounded-none overflow-hidden dark:text-background">
                <p className="text-sm">
                  Are you sure you want to publish this template? Your agent
                  will be accessible to others as template.
                </p>

                <div className="flex items-center gap-2 border-yellow-500 bg-yellow-500/10 border rounded-md p-2">
                  <AlertCircle className="text-yellow-500" />
                  <div className="text-xs">
                    Once published, your agent can neither be edited nor be used
                    for deployment.
                  </div>
                </div>
                <div className="flex items-center gap-2 border-blue-500 bg-blue-500/10 border rounded-md p-2">
                  <AlertCircle className="text-blue-500" />
                  <div className="text-xs">
                    Once published, Your Socials and Environment variables will
                    not be shared.
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2 p-4">
            <div className="flex items-center gap-2 justify-between w-full">
              <div>
                <Checkbox
                  isSelected={visibility === "LISTED"}
                  onValueChange={(value) =>
                    setVisibility(value ? "LISTED" : "UNLISTED")
                  }
                  className={cn(step === 1 && "hidden")}
                  classNames={{
                    wrapper: "after:bg-black/80 dark:invert",
                  }}
                  isDisabled={isPublishingTemplate}
                >
                  <p className="text-xs font-medium text-black/80 dark:text-background capitalize">
                    {visibility.toLowerCase()}
                  </p>
                </Checkbox>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
                  onPress={() => {
                    if (step === 1) {
                      setIsTemplateOpen(false);
                      return;
                    }
                    setStep(1);
                  }}
                  isDisabled={isPublishingTemplate}
                >
                  {step === 1 ? "Cancel" : "Back"}
                </Button>
                <Button
                  className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
                  onPress={() => {
                    if (step === 1) {
                      setStep(2);
                      return;
                    }
                    handlePublishTemplate(
                      name,
                      description,
                      category,
                      tags,
                      selectedIcon,
                      visibility,
                      author,
                      workspace?.id,
                      workspace?.teamId
                    );
                  }}
                  isDisabled={
                    isPublishingTemplate ||
                    !name ||
                    !description ||
                    !category ||
                    !author ||
                    tags.length === 0 ||
                    !selectedIcon
                  }
                >
                  {isPublishingTemplate ? (
                    <Loader2 className="animate-spin text-background dark:text-black" />
                  ) : step === 1 ? (
                    "Next"
                  ) : (
                    "Publish"
                  )}
                </Button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
