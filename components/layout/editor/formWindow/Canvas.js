"use client";

import ComponentRenderer from "./ComponentRenderer";
import PreviewRenderer from "./PreviewRenderer";
import DropZone from "./DropZone";
import { FileQuestionIcon, Plus } from "lucide-react";
import { useState } from "react";
import LogoAnimation from "@/components/ui/LogoAnimation";
import useFormStore from "@/store/useFormStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Card } from "@/components/ui/card";

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
    isPreview: isPreviewMode,
    addComponent,
    selectComponent,
    reorderComponents,
  } = useFormStore();

  const { isFormInitializing } = useWorkspaceStore();

  const [draggedIndex, setDraggedIndex] = useState(null);

  if (isFormInitializing) {
    return <LogoAnimation opacity={0.5} />;
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  };

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
      <div className="h-full absolute w-full overflow-y-auto hide-scroll">
        <div className="h-full relative w-full">
          <div className="p-2 pl-0 min-h-full flex flex-col items-center max-w-4xl mx-auto">
            {components.length === 0 ? (
              <Card className="border border-foreground/10 w-full max-w-5xl flex-1 rounded-2xl min-h-full relative">
                <div className="absolute flex flex-col items-center justify-center bg-foreground/2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[calc(100%-32px)] w-[calc(100%-32px)] border-2 border-foreground/30 border-dashed rounded-xl">
                  <div className="mb-4 bg-foreground rounded-xl p-4 opacity-80">
                    <FileQuestionIcon className="w-12 h-12 text-background" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    No components to preview
                  </h3>
                  <p className="text-sm text-foreground/50 text-center max-w-sm">
                    Switch to edit mode and add some components first.
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="border border-foreground/10 p-8 w-full flex-1 max-w-5xl py-12 min-h-full rounded-2xl">
                <div className="max-w-full flex flex-col gap-4">
                  {sortedComponents.map((component) => (
                    <PreviewRenderer key={component.id} component={component} />
                  ))}
                </div>
              </Card>
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
