import { Globe } from "lucide-react";
import SwitchTemplateType from "@/components/layout/dashboard/templates/SwitchTemplateType";

export default function TemplateLayout({ children }) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-4 border-b border-foreground/15">
        <div className="flex gap-2">
          <Globe size={14} className="mt-1" />

          <div className="flex flex-col gap-0.5">
            <h1 className="text-sm font-medium">Templates</h1>
            <p className="text-xs text-foreground/50">
              Choose from pre-built templates to get started
            </p>
          </div>
        </div>

        <SwitchTemplateType />
      </div>
      {children}
    </div>
  );
}
