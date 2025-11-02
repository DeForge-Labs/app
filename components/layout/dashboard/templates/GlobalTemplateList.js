import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DynamicIcon } from "lucide-react/dynamic";
import { GitBranch, GlobeLock, SearchX } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import PageSection from "../apps/PageSection";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ErrorDialog from "@/components/ui/ErrorDialog";

export default async function GlobalTemplateList({ teamId, page, query }) {
  const getGlobalTemplates = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(
        `${process.env.API_URL}/template/global?page=${page || 1}&query=${
          query || ""
        }&limit=12`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            cookie: cookieHeader,
          },
          credentials: "include",
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const globalTemplatesData = await getGlobalTemplates();

  if (!globalTemplatesData) {
    redirect("/server-not-found");
  }

  if (!globalTemplatesData?.success) {
    return <ErrorDialog error={globalTemplatesData?.message} />;
  }

  const templates = globalTemplatesData.templates;

  const totalPages = globalTemplatesData.totalPages;

  const totalTemplates = globalTemplatesData.totalTemplates;

  return (
    <>
      <div className="w-full max-w-[1390px]">
        {templates.length === 0 && query && (
          <div className="flex flex-col items-center justify-center h-full bg-foreground/2 w-full max-w-[1360px] border border-foreground/15 border-dashed rounded-sm p-4 py-6 gap-2">
            <div className="p-4 bg-background rounded-sm border border-foreground/15">
              <SearchX className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-center text-foreground/70 text-sm mt-2">
              No Templates found based on your search.
            </p>

            <Link href={`/templates`}>
              <Button className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit">
                <X />
                Clear Search
              </Button>
            </Link>
          </div>
        )}

        {templates.length === 0 && !query && (
          <div className="flex flex-col items-center justify-center h-full bg-foreground/2 w-full max-w-[1360px] border border-foreground/15 border-dashed rounded-sm p-4 py-6 gap-2">
            <div className="p-4 bg-background rounded-sm border border-foreground/15">
              <GlobeLock className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-center text-foreground/70 text-sm mt-2">
              No Templates found.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
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

                    <Badge className="mt-4 w-fit text-[10px] p-1 py-0.5 bg-transparent text-foreground/60 ">
                      <User className="size-3" /> {template?.author}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center w-full mt-4">
        <PageSection
          totalPages={totalPages}
          totalWorkspaces={totalTemplates}
          page={page}
          query={query}
          teamId={teamId}
          route="templates"
          topLimit={12}
        />
      </div>
    </>
  );
}
