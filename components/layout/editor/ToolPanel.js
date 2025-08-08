"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Blocks, Code, Link2, Play, Rocket, StickyNote } from "lucide-react";
import { Button, Tooltip } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { setPanel } from "@/redux/slice/WorkflowSlice";
import DeployButton from "./editorWindow/toolPanel/DeployButton";
import FallbackButton from "./editorWindow/toolPanel/FallbackButton";
import SaveButton from "./editorWindow/toolPanel/SaveButton";
import RunButton from "./editorWindow/toolPanel/RunButton";

const tabs = [
  { type: "separator" },
  { title: "Editor", icon: Code },
  { title: "Deployments", icon: Link2 },
];

export default function ToolPanel({ className, onChange }) {
  const dispatch = useDispatch();
  const panel = useSelector((state) => state.workflow.panel);

  const isWorkflowInitializing = useSelector(
    (state) => state.workflow.isWorkflowInitializing
  );
  const mode = useSelector((state) => state.workflow.mode);
  const hasUnsavedChanges = useSelector(
    (state) => state.workflow.hasUnsavedChanges
  );
  const hasUnsavedChangesForm = useSelector(
    (state) => state.form.hasUnsavedChanges
  );
  const workflow = useSelector((state) => state.workflow.workflow);

  const handleSelect = (index) => {
    dispatch(setPanel(index));
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-black/50" aria-hidden="true" />
  );

  return (
    !isWorkflowInitializing && (
      <div
        className={cn(
          "flex items-center justify-center gap-2 absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-lg border bg-white p-2 px-3 border-black/50 border-b-0 shadow-sm z-10",
          className
        )}
      >
        <RunButton />

        {workflow?.status !== "LIVE" &&
          (hasUnsavedChanges || hasUnsavedChangesForm) && <SaveButton />}

        {workflow?.status !== "LIVE" &&
          !(hasUnsavedChanges || hasUnsavedChangesForm) &&
          (panel === 1 ? (
            <Button
              variant="icon"
              size="icon"
              onPress={() => handleSelect(2)}
              className="w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-4"
            >
              <Rocket size={16} />
              Deploy
            </Button>
          ) : (
            <Button
              variant="icon"
              size="icon"
              onPress={() => handleSelect(1)}
              className="w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-4"
            >
              {mode === "workflow" ? (
                <Blocks size={16} />
              ) : (
                <StickyNote size={16} />
              )}
              {mode === "workflow" ? "Workflow" : "Form"}
            </Button>
          ))}
        {workflow?.status === "LIVE" && (
          <FallbackButton className="w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-4" />
        )}

        {tabs.map((tab, index) => {
          if (tab.type === "separator") {
            return (
              <Separator
                key={`separator-${index}`}
                className="border-black/50"
              />
            );
          }

          const Icon = tab.icon;
          return (
            <button
              key={tab.title}
              onClick={() => handleSelect(index)}
              className={cn(
                "relative flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 gap-2",
                panel === index
                  ? "bg-black/10 text-black"
                  : "hover:bg-black/10 hover:text-black "
              )}
            >
              <Icon size={16} />

              <span className="overflow-hidden text-xs">{tab.title}</span>
            </button>
          );
        })}
      </div>
    )
  );
}
