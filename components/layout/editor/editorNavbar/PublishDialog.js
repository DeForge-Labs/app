import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  LayoutTemplate,
  Zap,
  Atom,
  Calendar,
  ChartLine,
  ClipboardList,
  Boxes,
  Database,
  Info,
  ShieldUserIcon,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DynamicIcon } from "lucide-react/dynamic";
import usePublishTemplate from "@/hooks/usePublishTemplate";

export default function PublishDialog({ isOpen, setIsOpen }) {
  const [view, setView] = useState("FORM");
  const { handlePublishTemplate, isPublishingTemplate } = usePublishTemplate();

  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [iconId, setIconId] = useState("layout-template");
  const [category, setCategory] = useState("General");
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  const iconList = [
    {
      name: "layout-template",
      icon: <LayoutTemplate className="w-5 h-5" />,
    },
    {
      name: "zap",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      name: "atom",
      icon: <Atom className="w-5 h-5" />,
    },
    {
      name: "calendar",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      name: "chart-line",
      icon: <ChartLine className="w-5 h-5" />,
    },
    {
      name: "clipboard-list",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      name: "boxes",
      icon: <Boxes className="w-5 h-5" />,
    },
    {
      name: "database",
      icon: <Database className="w-5 h-5" />,
    },
  ];

  const categoryList = [
    {
      label: "General",
      value: "General",
    },
    {
      label: "Customer Support",
      value: "Customer Support",
    },
    {
      label: "Career & Job Search",
      value: "Career & Job Search",
    },
    {
      label: "Social Media Automation",
      value: "Social Media Automation",
    },
    {
      label: "Productivity",
      value: "Productivity",
    },
    {
      label: "Content Creation",
      value: "Content Creation",
    },
    {
      label: "Ecommerce",
      value: "Ecommerce",
    },
    {
      label: "Social Media & Marketing",
      value: "Social Media & Marketing",
    },
    { label: "Utilities", value: "Utilities" },
    { label: "Audio & Content Creation", value: "Audio & Content Creation" },
    {
      label: "Misc",
      value: "Misc",
    },
    {
      label: "Programming",
      value: "Programming",
    },
  ];

  const handleIsOpenChange = (open) => {
    if (isPublishingTemplate) return;
    setIsOpen(open);
  };

  const handlePublishOpenChange = (open) => {
    if (isPublishingTemplate) return;
    setIsPublishOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
      <DialogPopup className={"sm:max-w-sm"}>
        <Form>
          <DialogHeader>
            <DialogTitle className={"text-lg  font-medium"}>
              Publish Workflow
            </DialogTitle>
            <DialogDescription className={"text-xs "}>
              Publish your workflow to make it available to your users and list
              it in the app directory.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence>
            {!isPublishOpen && (
              <motion.div
                key="publish-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap gap-2">
                  {iconList.map((icon) => (
                    <Button
                      key={icon.name}
                      variant="outline"
                      className={cn(
                        "p-2 border border-foreground/15 bg-background rounded-sm hover:bg-foreground/5 cursor-pointer z-10",
                        icon.name === iconId && "border-foreground",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIconId(icon.name);
                      }}
                    >
                      <DynamicIcon
                        name={icon.name}
                        className="w-5 h-5 opacity-70"
                      />
                    </Button>
                  ))}
                </div>

                <Input
                  placeholder="Workflow Name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />

                <Textarea
                  placeholder="Workflow Description"
                  value={workflowDescription}
                  rows={4}
                  style={{
                    resize: "none",
                  }}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                />

                <Input
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />

                <Select
                  items={categoryList}
                  value={category}
                  disabled={isPublishingTemplate}
                  onValueChange={setCategory}
                >
                  <SelectTrigger aria-label="Select visibility">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectPopup>
                    {categoryList.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5 p-2 -mt-4 border rounded-md border-dashed border-foreground/15">
            <p className="text-[10px] opacity-70 ml-1">
              Choose your default view
            </p>

            <Tabs value={view}>
              <TabsList className="bg-background w-full [&>span]:bg-foreground/5 [&>span]:rounded-md">
                <TabsTab
                  value="FORM"
                  onClick={() => setView("FORM")}
                  className="text-xs"
                >
                  Form
                </TabsTab>
                <TabsTab
                  value="WORKFLOW"
                  onClick={() => setView("WORKFLOW")}
                  className="text-xs"
                >
                  Workflow
                </TabsTab>
              </TabsList>
            </Tabs>
          </div>

          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" className="text-xs" />}
            >
              Cancel
            </DialogClose>
            <Button
              className="text-background rounded-md border-none text-xs"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsPublishOpen(true);
              }}
              disabled={
                !workflowName || !workflowDescription || !author || !category
              }
            >
              {isPublishingTemplate ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Publish"
              )}
            </Button>

            <Dialog open={isPublishOpen} onOpenChange={handlePublishOpenChange}>
              <DialogPopup className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle className={"text-lg font-medium opacity-80"}>
                    Publish Workflow
                  </DialogTitle>
                  <DialogDescription className={"text-xs"}>
                    Ready to publish your workflow?
                  </DialogDescription>
                </DialogHeader>

                <div className="flex bg-foreground/5 rounded-md p-2 gap-2 text-xs text-foreground/50 relative overflow-hidden">
                  <Info className="size-20 mt-0.5 absolute -bottom-5 -right-5 opacity-15" />
                  <div className="flex flex-col">
                    Your Chats will be lost after publishing.
                    <p>Your current workspace will be deleted.</p>
                  </div>
                </div>

                <div className="flex bg-foreground/5 rounded-md p-2 gap-2 text-xs text-foreground/50 relative overflow-hidden">
                  <ShieldUserIcon className="size-16 mt-0.5 absolute -bottom-3 -right-2 opacity-15" />
                  <div className="flex flex-col">
                    Your environment variables and
                    <p>social connections will not be shared.</p>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose
                    render={<Button variant="ghost" className="text-xs" />}
                  >
                    Back
                  </DialogClose>
                  <Button
                    className="bg-foreground/90 text-background rounded-md border-none text-xs"
                    onClick={() => {
                      handlePublishTemplate(
                        workflowName,
                        workflowDescription,
                        category,
                        view,
                        iconId,
                        author,
                        setIsPublishOpen,
                      );
                    }}
                    type="submit"
                    disabled={isPublishingTemplate}
                  >
                    {isPublishingTemplate ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Publish"
                    )}
                  </Button>
                </DialogFooter>
              </DialogPopup>
            </Dialog>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
