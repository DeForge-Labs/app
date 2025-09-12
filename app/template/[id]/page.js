import TemplateNavbar from "@/components/layout/template/TemplateNavbar";
import TemplateWindow from "@/components/layout/template/TemplateWindow";

export default function TemplatePage() {
  return (
    <div className="flex flex-col h-screen dark:bg-dark">
      <TemplateNavbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TemplateWindow />
      </div>
    </div>
  );
}
