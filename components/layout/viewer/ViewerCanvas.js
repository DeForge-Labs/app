"use client";

import PreviewRenderer from "../editor/formWindow/PreviewRenderer";
import { FileQuestionIcon } from "lucide-react";
import LogoAnimation from "@/components/ui/LogoAnimation";
import useFormStore from "@/store/useFormStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Canvas() {
  const {
    components,

    formModal,
  } = useFormStore();

  const { isFormInitializing } = useWorkspaceStore();

  if (isFormInitializing) {
    return <LogoAnimation opacity={0.5} />;
  }

  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  return (
    <div className="h-full absolute w-full overflow-y-auto hide-scroll">
      <div className="h-full relative w-full">
        <div
          className={cn(
            "p-2 min-h-full flex flex-col items-center max-w-4xl mx-auto",
            formModal && "pl-2"
          )}
        >
          {components.length === 0 ? (
            <Card className="border border-foreground/10 w-full max-w-5xl flex-1 rounded-2xl min-h-full relative">
              <div className="absolute flex flex-col items-center justify-center bg-foreground/2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[calc(100%-32px)] w-[calc(100%-32px)] border-2 border-foreground/30 border-dashed rounded-xl">
                <div className="mb-4 bg-foreground rounded-xl p-4 opacity-80">
                  <FileQuestionIcon className="w-12 h-12 text-background" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  No components in this form
                </h3>
                <p className="text-sm text-foreground/50 text-center max-w-sm">
                  There are no components in this form.
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
