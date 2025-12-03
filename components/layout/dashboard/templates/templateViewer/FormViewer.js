import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileQuestionIcon } from "lucide-react";
import FormComponents from "./FormComponents";

export default function FormViewer({ components, nodeLibrary, nodes, edges }) {
  return (
    <div className="h-full absolute w-full overflow-y-auto hide-scroll">
      <div className="h-full relative w-full">
        <div
          className={cn(
            "p-2 min-h-full flex flex-col items-center max-w-4xl mx-auto"
          )}
        >
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
            <Card className="border border-foreground/10 p-8 w-full flex-1 max-w-5xl py-12 min-h-[700px] rounded-2xl">
              <div className="max-w-full flex flex-col gap-4">
                {components.map((component) => (
                  <FormComponents
                    key={component.id}
                    component={component}
                    nodeRegistry={nodeLibrary}
                    nodes={nodes}
                    edges={edges}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
