import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MessageCircleDashed, SearchX, X } from "lucide-react";
import Link from "next/link";
import MenuBox from "./MenuBox";
import IconDialog from "./IconDialog";
import { Plus } from "lucide-react";
import PageSection from "./PageSection";
import ErrorDialog from "@/components/ui/ErrorDialog";

export default async function AppList({ teamId, page, query }) {
  const getApps = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(
        `${process.env.API_URL}/workspace/list?page=${page || 1}&query=${
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

  const appsData = await getApps();

  if (!appsData) {
    redirect("/server-not-found");
  }

  if (!appsData?.success) {
    return <ErrorDialog message={appsData?.message} />;
  }

  const workspaces = appsData.workspaces;

  const totalPages = appsData.totalPages;

  const totalWorkspaces = appsData.totalWorkspaces;

  return (
    <>
      {workspaces.length === 0 && query && (
        <div className="flex flex-col items-center justify-center h-full bg-foreground/2 w-full max-w-[1360px] border border-foreground/15 border-dashed rounded-sm p-4 py-6 gap-2">
          <div className="p-4 bg-background rounded-sm border border-foreground/15">
            <SearchX className="w-5 h-5 opacity-70" />
          </div>
          <p className="text-center text-foreground/70 text-sm mt-2">
            No apps found based on your search.
          </p>

          <Link href={`/apps`}>
            <Button className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit">
              <X />
              Clear Search
            </Button>
          </Link>
        </div>
      )}

      {workspaces.length === 0 && !query && (
        <div className="flex flex-col items-center justify-center h-full bg-foreground/2 w-full max-w-[1360px] border border-foreground/15 border-dashed rounded-sm p-4 py-6 gap-2">
          <div className="p-4 bg-background rounded-sm border border-foreground/15">
            <MessageCircleDashed className="w-5 h-5 opacity-70" />
          </div>
          <p className="text-center text-foreground/70 text-sm mt-2">
            You have not created any apps yet.
          </p>

          <Link href={`/dashboard`}>
            <Button className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit">
              <Plus />
              New App
            </Button>
          </Link>
        </div>
      )}

      {workspaces.map((app, index) => {
        const timeAgo = formatDistanceToNow(app.workflow?.updatedAt, {
          addSuffix: true,
        });

        return (
          <div
            className="flex flex-col relative gap-2 border w-full border-foreground/15 rounded-sm p-4 bg-foreground/2 hover:shadow-sm transition-shadow shadow-foreground/10 max-w-[1360px]"
            key={index}
          >
            <Link
              className="absolute inset-0"
              href={
                app?.workflow?.status === "LIVE"
                  ? `/viewer/${app.id}`
                  : `/editor/${app.id}`
              }
            />

            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-sm">{app?.name}</p>

                <p className="text-xs text-foreground/70">Updated {timeAgo}</p>
              </div>

              <IconDialog appId={app.id} appIcon={app.iconId} />
            </div>

            <Separator className="my-2 bg-foreground/15" />

            <div className="flex justify-between items-center -mt-2 -mb-1">
              <p className="text-[10px] text-foreground/70">
                Created{" "}
                {formatDistanceToNow(app.createdAt, {
                  addSuffix: true,
                })}
              </p>

              <MenuBox
                appId={app.id}
                appName={app.name}
                isFavorite={app.isFavorite}
              />
            </div>
          </div>
        );
      })}

      <PageSection
        totalPages={totalPages}
        totalWorkspaces={totalWorkspaces}
        page={page}
        query={query}
        teamId={teamId}
      />
    </>
  );
}
