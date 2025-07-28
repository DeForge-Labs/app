"use client";

import LogoAnimation from "@/components/ui/LogoAnimation";
import PreviewRenderer from "../editor/formWindow/PreviewRenderer";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";

export default function FormRenderer() {
  const components = useSelector((state) => state.form.components);
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);
  const isWorkspaceInitializing = useSelector(
    (state) => state.workflow.isWorkspaceInitializing
  );
  const isWorkflowInitializing = useSelector(
    (state) => state.workflow.isWorkflowInitializing
  );

  if (isWorkspaceInitializing || isWorkflowInitializing) {
    return <LogoAnimation opacity={0.5} />;
  }

  return (
    <div className="overflow-y-auto hide-scroll flex-1 relative dark:text-background">
      <div className="flex-1 flex flex-col absolute w-full p-8 pt-10 pb-16">
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
  );
}
