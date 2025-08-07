"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import TemplateGridCard from "./TemplateGridCard";
import LogoAnimation from "@/components/ui/LogoAnimation";

export default function Templates() {
  const defaultTemplates = useSelector((state) => state.team.defaultTemplate);
  const isDefaultTemplatesInitializing = useSelector(
    (state) => state.team.isDefaultTemplatesInitializing
  );

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (defaultTemplates) {
      const allCategories = [
        ...defaultTemplates.map((t) => {
          return {
            name: t.category,
          };
        }),
      ];

      const uniqueCategories = [...new Set(allCategories.map((c) => c.name))];

      setCategories(
        uniqueCategories.map((c) => {
          return {
            name: c,
          };
        })
      );
    }
  }, [defaultTemplates]);

  if (isDefaultTemplatesInitializing) return <LogoAnimation />;

  return (
    <div className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-6">
      <div className="flex flex-col gap-6">
        {defaultTemplates?.length > 0 &&
          !isDefaultTemplatesInitializing &&
          categories.map((category, index) => (
            <div key={index} className="gap-2 text-black dark:text-background">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Terminal size={14} />
                {category.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {defaultTemplates
                  .filter((t) => t.category === category.name)
                  .map((template, index) => (
                    <TemplateGridCard flow={template} key={index} />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
