"use client";

import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Link,
  SquareMousePointer,
  X,
  Plus,
  Play,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import useFormStore from "@/store/useFormStore";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const componentTypes = [
  {
    type: "component",
    label: "Node Component",
    icon: SquareMousePointer,
    description: "Add a node component to the form",
  },
  {
    type: "paragraph",
    label: "Paragraph",
    icon: Type,
    defaultContent: "This is a paragraph. Click to edit.",
    description: "Add body text, descriptions, or detailed content",
  },
  {
    type: "heading1",
    label: "Heading 1",
    icon: Heading1,
    defaultContent: "Heading 1",
    description: "Main title or primary heading for sections",
  },
  {
    type: "heading2",
    label: "Heading 2",
    icon: Heading2,
    defaultContent: "Heading 2",
    description: "Secondary heading for subsections",
  },
  {
    type: "heading3",
    label: "Heading 3",
    icon: Heading3,
    defaultContent: "Heading 3",
    description: "Tertiary heading for smaller sections",
  },
  {
    type: "link",
    label: "Link",
    icon: Link,
    defaultContent: "Click here",
    url: "https://example.com",
    description: "Add clickable links to external websites",
  },
  {
    type: "divider",
    label: "Divider",
    icon: Minus,
    defaultContent: "",
    description: "Visual separator to organize content sections",
  },
  {
    type: "run",
    label: "Run Button",
    icon: Play,
    description: "Add a run button to the form",
  },
];

export default function FormMenu() {
  const { formModal: isMinimized, setFormModal: setIsMinimized } =
    useFormStore();
  const { addComponent } = useFormStore();

  const [hoveredType, setHoveredType] = useState(null);

  const add = (componentType) => {
    addComponent({
      type: componentType.type,
      content: componentType.defaultContent,
      url: componentType.url || undefined,
      component: "form",
    });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsMinimized(false)}
            className="w-12 h-12 rounded-lg relative z-20 bg-foreground text-background flex items-center justify-center cursor-pointer transition-colors shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="size-6" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            layout
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="flex flex-col relative z-20 bg-card border border-foreground/15 rounded-lg h-fit max-h-[90vh]"
          >
            <div className="flex flex-col items-center py-2 px-2 gap-2">
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(var(--foreground), 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMinimized(true)}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-md"
              >
                <X className="size-5" />
              </motion.button>

              <Separator />

              <div className="flex flex-col gap-2 overflow-visible">
                {componentTypes.map((component, index) => {
                  const IconComponent = component.icon;
                  return (
                    <motion.div
                      key={component.type}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative flex items-center"
                      onMouseEnter={() => setHoveredType(component.type)}
                      onMouseLeave={() => setHoveredType(null)}
                    >
                      <motion.button
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgba(var(--foreground), 0.05)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => add(component)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                          hoveredType === component.type
                            ? "bg-foreground/10 text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <IconComponent className="size-5" />
                      </motion.button>

                      <AnimatePresence>
                        {hoveredType === component.type && (
                          <motion.div
                            initial={{ opacity: 0, x: 10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 15, scale: 1 }}
                            exit={{ opacity: 0, x: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-full top-0 z-50 ml-2 w-64 pointer-events-none"
                          >
                            <Card className="bg-popover border-foreground/20 shadow-xl overflow-hidden py-1">
                              <div className="flex items-center gap-3 p-3">
                                <div className="flex items-center justify-center p-2 rounded-lg bg-foreground/5 shrink-0">
                                  <IconComponent className="size-5 opacity-70" />
                                </div>

                                <div className="flex flex-col gap-0.5">
                                  <h4 className="text-sm font-semibold leading-none">
                                    {component.label}
                                  </h4>
                                  <p className="text-[10px] text-muted-foreground leading-snug">
                                    {component.description}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
