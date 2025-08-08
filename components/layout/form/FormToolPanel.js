"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Link2, StickyNote } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setPanel } from "@/redux/slice/WorkflowSlice";
import RunButton from "../editor/editorWindow/toolPanel/RunButton";

const tabs = [
  { type: "separator" },
  { title: "Form", icon: StickyNote },
  { title: "Deployments", icon: Link2 },
];

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected) => ({
    gap: isSelected ? ".5rem" : ".5rem",
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

export default function FormToolPanel({ className, onChange }) {
  const dispatch = useDispatch();
  const panel = useSelector((state) => state.workflow.panel);
  const isWorkflowInitializing = useSelector(
    (state) => state.workflow.isWorkflowInitializing
  );

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
        {tabs.map((tab, index) => {
          if (tab.type === "separator") {
            return null;
          }

          const Icon = tab.icon;
          return (
            <button
              key={tab.title}
              onClick={() => handleSelect(index)}
              className={cn(
                "relative flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 gap-1",
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
