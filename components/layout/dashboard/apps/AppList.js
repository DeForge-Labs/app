import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { DynamicIcon } from "lucide-react/dynamic";
import { Menu, MenuPopup, MenuTrigger } from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { Copy, Ellipsis, Pen, Star, Trash } from "lucide-react";
import Link from "next/link";

export default async function AppList({ teamId, page, query }) {
  const getApps = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(
        `${process.env.API_URL}/workspace/list/${teamId}?page=${
          page || 1
        }&query=${query || ""}&limit=10`,
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
    redirect("/");
  }

  const workspaces = appsData.workspaces;

  return (
    <>
      {workspaces.map((app, index) => {
        const timeAgo = formatDistanceToNow(app.workflow.updatedAt, {
          addSuffix: true,
        });

        return (
          <div
            className="flex flex-col relative gap-2 border w-full border-foreground/15 rounded-sm p-4 bg-foreground/2 hover:shadow-sm transition-shadow shadow-foreground/10 max-w-[1360px]"
            key={index}
          >
            <Link className="absolute inset-0" href={`/editor/${app?.id}`} />

            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-sm">{app?.name}</p>

                <p className="text-xs text-foreground/70">Updated {timeAgo}</p>
              </div>

              <div className="p-2 border border-foreground/15 bg-background rounded-sm hover:bg-foreground/5 cursor-pointer z-10">
                <DynamicIcon
                  name={app?.iconId}
                  className="w-5 h-5 opacity-70"
                />
              </div>
            </div>

            <Separator className="my-2 bg-foreground/15" />

            <div className="flex justify-between items-center -mt-2 -mb-1">
              <p className="text-[10px] text-foreground/70">
                Created{" "}
                {formatDistanceToNow(app.createdAt, {
                  addSuffix: true,
                })}
              </p>

              <Menu>
                <MenuTrigger
                  render={
                    <Button
                      className="flex gap-2 bg-transparent font-normal px-1 min-h-4 !pointer-coarse:after:min-h-4 h-5 w-fit z-10 !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60 border border-foreground/15"
                      variant="outline"
                    >
                      <Ellipsis />
                    </Button>
                  }
                ></MenuTrigger>

                <MenuPopup
                  align="end"
                  sideOffset={5}
                  className={
                    " border border-foreground/30 rounded-lg w-[160px]"
                  }
                >
                  <Button
                    variant="outline"
                    className="data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent !shadow-none bg-transparent hover:bg-transparent w-full justify-start border-none"
                  >
                    <Pen className="w-4 h-4" /> Rename
                  </Button>
                  <Button
                    variant="outline"
                    className="data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent !shadow-none bg-transparent hover:bg-transparent w-full justify-start border-none"
                  >
                    <Copy className="w-4 h-4" /> Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    className="data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent !shadow-none bg-transparent hover:bg-transparent w-full justify-start border-none"
                  >
                    <Star className="w-4 h-4" /> Favourite
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent !shadow-none bg-transparent hover:bg-transparent w-full justify-start border-none"
                  >
                    <Trash className="w-4 h-4" /> Delete
                  </Button>
                </MenuPopup>
              </Menu>
            </div>
          </div>
        );
      })}
    </>
  );
}
