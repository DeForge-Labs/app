"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Code, GitBranchPlus, Link2, Play } from "lucide-react";
import { Button } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { setPanel } from "@/redux/slice/WorkflowSlice";

const tabs = [
  {
    type: "button",
    title: "",
    icon: Play,
    function: () => {},
  },
  {
    type: "button",
    title: "Deploy",
    icon: GitBranchPlus,
    function: () => {},
  },
  { type: "separator" },
  { title: "Editor", icon: Code },
  { title: "Deployments", icon: Link2 },
];

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export default function ToolPanel({ className, onChange }) {
  const dispatch = useDispatch();
  const panel = useSelector((state) => state.workflow.panel);

  const handleSelect = (index) => {
    dispatch(setPanel(index));
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-black/50" aria-hidden="true" />
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-lg w-fit border bg-white p-2 px-3 border-black/50 border-b-0 shadow-sm z-10",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return (
            <Separator key={`separator-${index}`} className="border-black/50" />
          );
        }

        if (tab.type === "button") {
          return (
            <Button
              key={index}
              onPress={tab.function}
              variant="icon"
              className={cn(
                "w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-xl px-2",
                tab.title ? "px-4" : ""
              )}
              size="icon"
            >
              <tab.icon size={16} />
              {tab.title}
            </Button>
          );
        }

        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={panel === index}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 ",
              panel === index
                ? "bg-black/10 text-black"
                : "hover:bg-black/10 hover:text-black "
            )}
          >
            <Icon size={16} />
            <AnimatePresence initial={false}>
              {panel === index && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden text-xs"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
