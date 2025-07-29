import TemplateProvider from "@/providers/TemplateProvider";

export default function TemplateLayout({ children, params }) {
  return <TemplateProvider params={params}>{children}</TemplateProvider>;
}
