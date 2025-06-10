"use client";

import { Calendar, User } from "lucide-react";
import { Chip } from "@heroui/react";
import { Button } from "@heroui/react";
import { FileLineChartIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemplateCard({ template }) {
  const router = useRouter();
  // Format date to be more readable
  const formattedDate = new Date(template.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div className="group rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
        <div className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 bg-black/5 flex items-center justify-center flex-col">
          <FileLineChartIcon className="h-12 w-12 mb-2" />
          <div className="text-sm">
            {template?.workflow?._count?.nodes} nodes,{" "}
            {template?.workflow?._count?.edges} connections
          </div>
        </div>

        <div className="absolute top-2 left-2">
          <Chip className="rounded-lg text-xs text-background bg-black/70">
            <span className="font-medium">{template.category}</span>
          </Chip>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold group-hover:text-black transition-colors line-clamp-1">
            <div
              onClick={() => router.push(`/templates/${template.id}`)}
              className="cursor-pointer"
            >
              {template.name}
            </div>
          </h3>
          <p className="text-sm text-black/60 line-clamp-4">
            {template.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8  rounded-md flex text-black bg-black/5  items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm text-black/70">{template.author}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              className="rounded-lg text-xs text-black/70 bg-black/10"
            >
              <span className="font-medium">{tag}</span>
            </Chip>
          ))}
          {template.tags.length > 3 && (
            <Chip className="rounded-lg text-xs text-black/70 bg-black/10">
              <span className="font-medium">+{template.tags.length - 3}</span>
            </Chip>
          )}
        </div>

        <Button
          variant="ghost"
          className="w-full text-black group-hover:bg-black/80 group-hover:text-white transition-colors mt-4 "
          onPress={() => router.push(`/templates/${template.id}`)}
        >
          View Template
        </Button>
      </div>
    </div>
  );
}
