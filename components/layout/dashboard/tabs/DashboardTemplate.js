import { ChevronRight, GitBranch } from "lucide-react";
import { templates } from "@/lib/TemplateData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicIcon } from "lucide-react/dynamic";
import { Badge } from "@/components/ui/badge";

export default function DashboardTemplate() {
  return (
    <div className="w-[90%] lg:w-[80%] flex flex-col gap-4 z-20 mt-20">
      <div className="flex w-full justify-between lg:items-center flex-col gap-2 lg:flex-row">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Popular Templates</p>
          <p className="text-xs text-foreground/60">
            Explore what others are automating using Deforge
          </p>
        </div>

        <div className="flex items-center gap-1 text-sm text-foreground/60 group hover:text-foreground hover:cursor-pointer">
          Browse All{" "}
          <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-all group-hover:text-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="hover:border hover:border-foreground/20 cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex flex-col gap-3">
                <div className="rounded-sm p-4 bg-foreground/10 w-fit">
                  <DynamicIcon
                    name={template.icon}
                    className="size-4 opacity-80"
                  />
                </div>
                <p className="text-sm font-semibold"> {template.name}</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="-mt-6 flex flex-col">
              <p className="text-xs text-foreground/60 line-clamp-4">
                {template.description}
              </p>

              <div className="flex gap-2">
                <Badge className="mt-4 w-fit text-[10px] p-1 py-0.5 border bg-transparent text-foreground/60 border-foreground/60">
                  {template.category}
                </Badge>

                <Badge className="mt-4 w-fit text-[10px] p-1 py-0.5 border bg-transparent text-foreground/60 border-foreground/60">
                  <GitBranch className="size-3" /> 42
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
