import TemplateNavbar from "@/components/layout/template/TemplateNavbar";

export default function TemplateLayout({ children }) {
  return (
    <div className="flex flex-col w-screen max-h-screen h-screen overflow-hidden dark:bg-dark">
      <TemplateNavbar />

      <div className="flex-1 flex">
        <div className="flex-1 flex bg-foreground/5 pb-2 px-2">
          <div className="flex-1 relative flex flex-col bg-background rounded-lg border border-foreground/15">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
