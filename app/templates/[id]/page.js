import TemplateBody from "@/components/layout/template/TemplateBody";
import TemplateNavbar from "@/components/layout/template/TemplateNavbar";

export default function Template() {
  return (
    <div className="flex flex-col min-h-screen">
      <TemplateNavbar />
      <TemplateBody />
    </div>
  );
}
