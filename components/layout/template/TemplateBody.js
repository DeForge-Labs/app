"use client";

import { Button, Chip } from "@heroui/react";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import { useSelector } from "react-redux";
import TemplateLoading from "./TemplateLoading";
import NodeVisualizer from "./NodeVisualizer";
import UseTemplateButton from "./UseTemplateButton";
import { useRouter } from "next/navigation";

export default function TemplateBody() {
  const router = useRouter();
  const template = useSelector((state) => state.template.template);
  const isTemplateInitializing = useSelector(
    (state) => state.template.isTemplateInitializing
  );

  if (isTemplateInitializing) {
    return <TemplateLoading />;
  }

  const createdDate = new Date(template.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updatedDate = new Date(template.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="container mx-auto py-6">
      <Button
        variant="outline"
        size="md"
        className="border border-black/50 h-9 rounded-lg text-black/80 text-xs"
        onPress={() => {
          router.push("/templates");
        }}
      >
        <ArrowLeft size={16} />
        Back to Templates
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Template Header */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Chip className="rounded-lg text-xs text-background bg-black/70">
                  <span className="font-medium">{template.category}</span>
                </Chip>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {template.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {template.description}
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{template.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created: {createdDate}</span>
              </div>
            </div>
          </div>

          {/* Template Preview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Template Preview</h2>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-black/30">
              <NodeVisualizer
                nodes={template?.workflow?.nodes}
                edges={template?.workflow?.edges}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Chip
                  key={tag}
                  className="rounded-lg text-xs text-black/70 bg-black/10"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium capitalize">{tag}</span>
                  </div>
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Use Template Card */}
          <div className="border rounded-lg p-6 space-y-4 border-black/30">
            <h3 className="font-semibold">Get This Template</h3>
            <div className="space-y-3">
              <UseTemplateButton />
            </div>
            <p className="text-xs text-muted-foreground">
              Click the button above to duplicate this template to your team
              workspace and start using it.
            </p>
          </div>

          {/* Author Card */}
          <div className="border rounded-lg p-6 space-y-4 border-black/30">
            <h3 className="font-semibold">Created by</h3>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8  rounded-md flex text-black bg-black/5  items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{template.author}</p>
                <p className="text-sm text-muted-foreground">
                  {template.author === "Team Deforge"
                    ? "Core Team"
                    : "Community Member"}
                </p>
              </div>
            </div>
          </div>

          {/* Template Info */}
          <div className="border rounded-lg p-6 space-y-4 border-black/30">
            <h3 className="font-semibold">Template Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm font-medium">{template.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{createdDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Last Updated
                </span>
                <span className="text-sm font-medium">{updatedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
