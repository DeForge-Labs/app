import { ChevronRight, GitBranch, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicIcon } from "lucide-react/dynamic";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import Link from "next/link";
import ErrorDialog from "@/components/ui/ErrorDialog";

export default async function DashboardTemplate({ teamId }) {
  const getPopularTemplates = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/template/global?limit=9`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const popularTemplates = await getPopularTemplates();

  if (!popularTemplates) {
    redirect("/server-not-found");
  }

  if (!popularTemplates?.success) {
    return <ErrorDialog error={popularTemplates?.message} />;
  }

  const templates = popularTemplates?.templates;

  return (
    <div className="w-[90%] lg:w-[80%] flex flex-col gap-4 z-20 mt-20">
      <div className="flex w-full justify-between lg:items-center flex-col gap-2 lg:flex-row">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Popular Templates</p>
          <p className="text-xs text-foreground/60">
            Explore what others are automating using Deforge
          </p>
        </div>

        <Link href={`/templates`}>
          <div className="flex items-center gap-1 text-sm text-foreground/60 group hover:text-foreground hover:cursor-pointer">
            Browse All{" "}
            <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-all group-hover:text-foreground" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <Link href={`/templates/${template.id}`} key={index}>
            <Card className="hover:border hover:border-foreground/20 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex flex-col gap-3">
                  <div className="rounded-sm p-4 bg-foreground/10 w-fit">
                    <DynamicIcon
                      name={template.iconId}
                      className="size-4 opacity-80"
                    />
                  </div>
                  <p className="text-sm font-semibold"> {template?.name}</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="-mt-6 flex flex-col flex-1 justify-between">
                <p className="text-xs text-foreground/60 line-clamp-4">
                  {template?.description}
                </p>

                <div className="flex gap-2 flex-wrap">
                  <Badge className="mt-4 w-fit text-[10px] p-1 py-0.5 border bg-transparent text-foreground/60 border-foreground/60 ">
                    {template?.category}
                  </Badge>

                  <Badge className="mt-4 w-fit text-[10px] p-1 py-0.5 border bg-transparent text-foreground/60 border-foreground/60">
                    <GitBranch className="size-3" /> {template?.totalClones}
                  </Badge>

                  <Badge className="mt-4 w-fit text-[10px] p-1 py-0.5 bg-transparent text-foreground/60">
                    <User className="size-3" /> {template?.author}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
