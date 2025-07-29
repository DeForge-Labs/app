"use client";

import { Chip } from "@heroui/react";
import { Calendar, User } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useSelector } from "react-redux";

export default function TemplateDetails() {
  const template = useSelector((state) => state.template.template);

  if (!template) {
    return null;
  }

  return (
    <div className="mx-auto min-h-full max-w-5xl p-12 w-full py-16 border border-black/50 rounded-b-none mb-3 dark:border-background bg-black/5 dark:bg-white/5 rounded-xl flex flex-col gap-4">
      <div className="flex items-center justify-center h-32 w-32 rounded-lg border-black/50 dark:border-background bg-black/5 dark:bg-white/5">
        <DynamicIcon name={template.iconId} className="h-12 w-12" />
      </div>
      <h1 className="text-3xl font-bold">{template.name}</h1>
      <p className="text-lg text-black/60 dark:text-background -mt-3">
        {template.description}
      </p>

      <div className="flex items-center gap-2">
        <Chip color="primary" variant="flat" size="sm">
          {template.category}
        </Chip>
        {template.tags.map((tag, index) => (
          <Chip key={index} size="sm" variant="flat">
            {tag}
          </Chip>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <User className="w-4 h-4" />
        <p className="text-sm text-black/60 dark:text-background">
          {template.author}
        </p>
        <Calendar className="w-4 h-4 ml-4" />
        <p className="text-sm text-black/60 dark:text-background">
          {new Date(template.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
