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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import useFormStore from "@/store/useFormStore";

const componentTypes = [
  {
    type: "node",
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
];

export default function FormMenu({ isMinimized = false, setIsMinimized }) {
  const { addComponent } = useFormStore();
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
          // Minimized Plus Button
          <motion.button
            key="minimized"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsMinimized(false)}
            className="w-12 h-12 rounded-lg relative z-20 bg-background hover:bg-foreground/5 border border-foreground/15 flex items-center justify-center cursor-pointer transition-colors shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="size-5" />
          </motion.button>
        ) : (
          // Full Form Components Menu
          <motion.div
            key="expanded"
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              scale: { duration: 0.2 },
              opacity: { duration: 0.2 },
              layout: { duration: 0.3, ease: "easeInOut" },
            }}
            className="flex flex-col w-80 relative z-20 bg-background border border-foreground/15 rounded-lg overflow-hidden max-h-full"
          >
            {/* Header */}
            <motion.div
              layout="position"
              className="flex gap-2 text-sm border-b border-foreground/15 p-4 relative z-20 shrink-0"
            >
              {setIsMinimized && (
                <div
                  className="absolute right-2 top-2 z-20 p-1 hover:bg-foreground/5 rounded-sm cursor-pointer"
                  onClick={() => setIsMinimized(true)}
                >
                  <X className="size-3" />
                </div>
              )}
              <SquareMousePointer className="size-4 mt-1" />
              <div className="flex flex-col">
                <p>Form Components</p>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Click on the component to add it to the form
                </p>
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div
              layout="position"
              className="overflow-y-auto p-4 custom-scrollbar flex-1 min-h-0"
            >
              <div className="space-y-2">
                {componentTypes.map((component, index) => {
                  const IconComponent = component.icon;
                  return (
                    <motion.div
                      key={component.type}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.12,
                        delay: index * 0.02,
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className="hover:shadow-md transition-shadow rounded-md border-foreground/10 p-0 py-3 gap-0 cursor-pointer"
                          onClick={() => add(component)}
                        >
                          <div className="flex items-center gap-2 px-4">
                            <div className="p-2 rounded-lg bg-foreground/5">
                              <IconComponent className="size-6 opacity-60" />
                            </div>
                            <div>
                              <CardHeader className="p-0 px-2">
                                <CardTitle className="text-xs font-medium">
                                  {component.label}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="px-2 -mt-1">
                                <p className="text-[10px] text-muted-foreground">
                                  {component.description}
                                </p>
                              </CardContent>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
