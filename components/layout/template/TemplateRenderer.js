"use client";

import LogoAnimation from "@/components/ui/LogoAnimation";
import PreviewRenderer from "../editor/formWindow/PreviewRenderer";
import { useSelector } from "react-redux";
import { EyeOff, Plus } from "lucide-react";
import TemplateDetails from "./TemplateDetails";
import { cn } from "@/lib/utils";

export default function TemplateRenderer() {
  const components = useSelector((state) => state.form.components);
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);
  const isTemplateInitializing = useSelector(
    (state) => state.template.isTemplateInitializing
  );
  const user = useSelector((state) => state.user.user);

  if (isTemplateInitializing) {
    return <LogoAnimation opacity={0.5} />;
  }

  return (
    <div className="overflow-y-auto hide-scroll flex-1 relative dark:text-background">
      <div className="flex-1 flex flex-col absolute w-full pt-4 pb-24">
        {components.length === 0 ? (
          <div className="flex flex-col items-center max-w-5xl mx-auto w-full justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
            <Plus className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-background">
              No components to preview
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              Make sure the template is valid
            </p>
          </div>
        ) : (
          <>
            <TemplateDetails />
            <div className="space-y-6 mx-auto min-h-full max-w-5xl p-12 w-full py-16 border border-black/50 rounded-t-none dark:border-background bg-black/5 dark:bg-white/5 rounded-xl relative">
              {user ? null : (
                <div className="h-full w-full rounded-b-xl bg-black/5 dark:bg-white/5 backdrop-blur-md absolute top-0 left-0 z-10 text-center flex flex-col items-center justify-center px-5">
                  <EyeOff className="w-12 h-12 text-gray-900 dark:text-white/70 mb-4" />
                  Sign in to view the template and deploy this AI Agent
                </div>
              )}
              {sortedComponents.map((component) => (
                <PreviewRenderer
                  key={component.id}
                  component={component}
                  isTemplate
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
