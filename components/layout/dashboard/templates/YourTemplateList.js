import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, GlobeLock, SearchX, Undo2, X } from "lucide-react";
import Link from "next/link";
import PageSection from "../apps/PageSection";
import { Menu, MenuPopup, MenuTrigger } from "@/components/ui/menu";
import { Ellipsis } from "lucide-react";
import ShareDialog from "./ShareDialog";
import UseTemplateDialog from "./UseTemplateDialog";
import RevertDialog from "./RevertDialog";

export default async function YourTemplateList({ teamId, page, query }) {
  const getTemplates = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(
        `${process.env.API_URL}/template/list?page=${page || 1}&query=${
          query || ""
        }&limit=10`,
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

  const templatesData = await getTemplates();

  if (!templatesData) {
    redirect("/server-not-found");
  }

  if (!templatesData?.success) {
    return redirect("/dashboard");
  }

  const templates = templatesData.templates;

  const totalPages = templatesData.totalPages;

  const totalTemplates = templatesData.totalTemplates;

  return (
    <>
      {templates.length === 0 && query && (
        <div className="flex flex-col items-center justify-center h-full bg-foreground/2 w-full max-w-[1360px] border border-foreground/15 border-dashed rounded-sm p-4 py-6 gap-2">
          <div className="p-4 bg-background rounded-sm border border-foreground/15">
            <SearchX className="w-5 h-5 opacity-70" />
          </div>
          <p className="text-center text-foreground/70 text-sm mt-2">
            No Templates found based on your search.
          </p>

          <Link href={`/templates/published`}>
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
            You have not created any templates yet.
          </p>
        </div>
      )}

      {templates.map((template, index) => {
        return (
          <div
            className="flex flex-col relative gap-2 border w-full border-foreground/15 rounded-sm p-4 bg-foreground/2 hover:shadow-sm transition-shadow shadow-foreground/10 max-w-[1360px]"
            key={index}
          >
            <Link
              className="absolute inset-0"
              href={`/templates/${template?.id}`}
            />

            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-sm">{template?.name}</p>

                <p className="text-xs text-foreground/70 line-clamp-2 max-w-2xl">
                  {template?.description}
                </p>
              </div>
            </div>

            <Separator className="my-2 bg-foreground/15" />

            <div className="flex justify-between items-center -mt-2 -mb-1">
              <p className="text-[10px] text-foreground/70">
                Created{" "}
                {formatDistanceToNow(template.createdAt, {
                  addSuffix: true,
                })}
              </p>

              <Menu>
                <MenuTrigger
                  render={
                    <Button
                      variant="outline"
                      className="flex gap-2 bg-transparent font-normal px-1 min-h-4 !pointer-coarse:after:min-h-4 h-5 w-fit z-10 shadow-none! [:hover,[data-pressed]]:bg-foreground/5 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60 border border-foreground/15"
                    >
                      <Ellipsis />
                    </Button>
                  }
                ></MenuTrigger>

                <MenuPopup
                  align="end"
                  sideOffset={5}
                  className="border border-foreground/30 rounded-lg w-40"
                >
                  <Link
                    href={`https://d4g.app/${template?.shortId}`}
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      className="data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent shadow-none! bg-transparent hover:bg-transparent w-full justify-start border-none"
                    >
                      <ArrowUpRight className="w-4 h-4" /> Open Template
                    </Button>
                  </Link>

                  <UseTemplateDialog
                    teamId={teamId}
                    templateId={template?.id}
                  />

                  <ShareDialog shortId={template?.shortId} />

                  <RevertDialog teamId={teamId} templateId={template?.id} />
                </MenuPopup>
              </Menu>
            </div>
          </div>
        );
      })}

      <PageSection
        totalPages={totalPages}
        totalWorkspaces={totalTemplates}
        page={page}
        query={query}
        teamId={teamId}
        route="templates/published"
        topLimit={10}
      />
    </>
  );
}
