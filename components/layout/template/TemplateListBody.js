"use client";

import { useSelector } from "react-redux";
import TemplatesLoading from "./TemplatesLoading";
import TemplateCard from "./TemplateCard";
import { CopyX } from "lucide-react";

export default function TemplateListBody() {
  const templates = useSelector((state) => state.template.templates);
  const isTemplatesInitializing = useSelector(
    (state) => state.template.isTemplatesInitializing
  );

  if (isTemplatesInitializing) {
    return <TemplatesLoading />;
  }

  if (!templates || !templates.length) {
    return (
      <section className="py-16 md:py-20">
        <div className="container h-[561.63px] flex flex-col items-center justify-center">
          <div className="rounded-full flex items-center justify-center w-16 h-16 bg-black/10 dark:bg-white/10">
            <CopyX className="h-5 w-5 text-black dark:text-background" />
          </div>
          <p className="text-black/60 mt-4 text-center dark:text-background">
            Pssst! Quite empty here
            <br />
            Visit again to see some templates
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </section>
  );
}
