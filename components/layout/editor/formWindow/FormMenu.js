"use client";

import { Type, Heading1, Heading2, Heading3, Minus, Link } from "lucide-react";
import { Card } from "@/components/ui/card";

const componentTypes = [
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

export default function FormMenu() {
  const handleDragStart = (e, componentType) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: componentType.type,
        content: componentType.defaultContent,
        url: componentType.url || undefined,
        component: "form",
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 absolute p-4 w-full">
      <h2 className="font-semibold text-xl dark:text-background">
        Form Components
      </h2>
      <div className="space-y-2">
        {componentTypes.map((component) => {
          const IconComponent = component.icon;
          return (
            <Card
              key={component.type}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              className="cursor-grab bg-background border rounded-lg border-black/50 hover:shadow-md dark:border-background dark:text-background dark:bg-zinc-900 active:cursor-grabbing"
            >
              <div className="flex items-center gap-2 p-3">
                <div className="bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                  <IconComponent className="w-6 h-6 dark:text-background" />
                </div>
                <div className="text-sm dark:text-background flex flex-col flex-1 gap-1">
                  <p className="font-semibold">{component.label}</p>
                  <p className="text-xs opacity-70">{component.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/50 dark:border-background dark:text-background">
        <p className="text-xs  dark:text-background">
          <strong>How to use:</strong> Drag components from here to the canvas
          area to build your form.
        </p>
      </div>
    </div>
  );
}
