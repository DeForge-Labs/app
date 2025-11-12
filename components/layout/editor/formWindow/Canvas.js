"use client";

import ComponentRenderer from "./ComponentRenderer";
import PreviewRenderer from "./PreviewRenderer";
import DropZone from "./DropZone";
import { Edit, Eye, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import LogoAnimation from "@/components/ui/LogoAnimation";
import { Button } from "@heroui/react";
import useFormStore from "@/store/useFormStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Card } from "@/components/ui/card";

const tabs = [
  { type: "separator" },
  { title: "Edit", icon: Edit, isPreview: false },
  { title: "Preview", icon: Eye, isPreview: true },
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

export default function Canvas() {
  const {
    components,
    selectedComponentId,
    isPreviewMode,
    addComponent,
    selectComponent,
    reorderComponents,
    setIsPreview,
    setIsSelector,
  } = useFormStore();

  const { isFormInitializing } = useWorkspaceStore();
  const [panel, setPanel] = useState(1);

  const [draggedIndex, setDraggedIndex] = useState(null);

  if (isFormInitializing) {
    return <LogoAnimation opacity={0.5} />;
  }

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-black/50" aria-hidden="true" />
  );

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  };

  const renderPanelSwitcher = () => (
    <div className="flex items-center fixed justify-center gap-2 left-1/2 -translate-x-1/2 rounded-b-lg border bg-white p-2 px-3 border-black/50 border-t-0 shadow-sm z-10">
      <Button
        onPress={() => {
          setIsSelector(true);
        }}
        variant="icon"
        className={cn(
          "w-fit text-xs p-1 gap-2 bg-black/80 text-background py-2 rounded-lg px-4"
        )}
        size="icon"
      >
        Select Node
      </Button>
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return (
            <Separator key={`separator-${index}`} className="border-black/50" />
          );
        }

        const Icon = tab.icon;
        return (
          <button
            key={tab.title}
            onClick={() => {
              setPanel(index);
              setIsPreview(tab.isPreview);
            }}
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
  );

  const handleReorder = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    const sortedComponents = [...components].sort((a, b) => a.order - b.order);
    const newComponents = [...sortedComponents];
    const [movedComponent] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, movedComponent);

    reorderComponents(newComponents);
  };

  const handleDropZoneReorder = (
    targetIndex,
    draggedFromIndex = null,
    newComponent = null
  ) => {
    if (newComponent) {
      // Handle new component from sidebar
      const componentWithOrder = {
        ...newComponent,
        order: targetIndex,
      };
      addComponent(componentWithOrder);
    } else if (draggedFromIndex !== null) {
      // Handle component reordering
      handleReorder(draggedFromIndex, targetIndex);
    }
  };

  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  if (isPreviewMode) {
    return (
      <div className="h-full absolute bg-background dark:bg-dark w-full overflow-y-auto hide-scroll">
        <div className="h-full relative w-full">
          <div className="min-h-full p-8 pt-20 pb-20">
            {components.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-background">
                  No components to preview
                </h3>
                <p className="text-gray-500 text-center max-w-sm">
                  Switch to edit mode and add some components first.
                </p>
              </div>
            ) : (
              <div className="space-y-6 mx-auto min-h-full max-w-5xl p-12 w-full py-16 border border-black/50 dark:border-background rounded-lg">
                {sortedComponents.map((component) => (
                  <PreviewRenderer key={component.id} component={component} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full absolute w-full overflow-y-auto hide-scroll">
      <div className="h-full relative w-full">
        <div
          className="p-2 pl-0 min-h-full flex flex-col items-center max-w-4xl mx-auto"
          onDragOver={handleDragOver}
          onClick={handleCanvasClick}
        >
          {components.length === 0 ? (
            <Card className="border border-foreground/10 w-full max-w-5xl flex-1 rounded-2xl min-h-full relative">
              <div className="absolute flex flex-col items-center justify-center bg-foreground/2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[calc(100%-32px)] w-[calc(100%-32px)] border-2 border-foreground/30 border-dashed rounded-xl">
                <div className="mb-4 bg-foreground rounded-xl p-4 opacity-80">
                  <Plus className="w-12 h-12 text-background" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  Start building your form
                </h3>
                <p className="text-sm text-foreground/50 text-center max-w-sm">
                  Click Components from the left sidebar to add them to your
                  form.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="border border-foreground/10 p-8 w-full flex-1 max-w-5xl py-12 min-h-full rounded-2xl">
              <div className="max-w-full">
                {/* Drop zone before first component */}
                <DropZone
                  index={0}
                  isDragging={draggedIndex !== null}
                  onDrop={(fromIndex, newComponent) =>
                    handleDropZoneReorder(0, fromIndex, newComponent)
                  }
                />

                {sortedComponents.map((component, index) => (
                  <div key={component.id}>
                    <ComponentRenderer
                      component={component}
                      index={index}
                      isSelected={selectedComponentId === component.id}
                      onReorder={handleReorder}
                      draggedIndex={draggedIndex}
                      setDraggedIndex={setDraggedIndex}
                    />

                    {/* Drop zone after each component */}
                    <DropZone
                      index={index + 1}
                      isDragging={draggedIndex !== null}
                      onDrop={(fromIndex, newComponent) =>
                        handleDropZoneReorder(
                          index + 1,
                          fromIndex,
                          newComponent
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
