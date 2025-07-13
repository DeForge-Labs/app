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
    <div className="group rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow flex h-full flex-col">
      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
        <div className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 bg-black/5 flex items-center justify-center flex-col dark:text-background">
          <FileLineChartIcon className="h-12 w-12 mb-2" />
          <div className="text-sm">
            {template?.workflow?._count?.nodes} nodes,{" "}
            {template?.workflow?._count?.edges} connections
          </div>
        </div>

        <div className="absolute top-2 left-2">
          <Chip className="rounded-lg text-xs text-background bg-black/70 dark:bg-background dark:text-black">
            <span className="font-medium">{template.category}</span>
          </Chip>
        </div>
      </div>

      <div className="p-6 space-y-4 flex flex-1 flex-col justify-between dark:text-background">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold group-hover:text-black transition-colors line-clamp-1 dark:text-background dark:group-hover:text-background">
            <div
              onClick={() => router.push(`/templates/${template.id}`)}
              className="cursor-pointer"
            >
              {template.name}
            </div>
          </h3>
          <p className="text-sm text-black/60 line-clamp-4 dark:text-background">
            {template.description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8  rounded-md flex text-black bg-black/5  items-center justify-center dark:bg-white/5 dark:text-background">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm text-black/70 dark:text-background">
              {template.author}
            </span>
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
                className="rounded-lg text-xs text-black/70 bg-black/10 dark:bg-white/5 dark:text-background"
              >
                <span className="font-medium">{tag}</span>
              </Chip>
            ))}
            {template.tags.length > 3 && (
              <Chip className="rounded-lg text-xs text-black/70 bg-black/10 dark:bg-white/5 dark:text-background">
                <span className="font-medium">+{template.tags.length - 3}</span>
              </Chip>
            )}
          </div>

          <Button
            className="w-full text-black bg-background border-black/30 border group-hover:bg-black/80 group-hover:text-white transition-colors dark:text-background dark:bg-white/10 dark:group-hover:bg-background dark:group-hover:text-black"
            onPress={() => router.push(`/templates/${template.id}`)}
          >
            View Template
          </Button>
        </div>
      </div>
    </div>
  );
}
