import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function FavoriteApps({ params }) {
  const { id } = await params;

  const getFavoriteApps = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(
        `${process.env.API_URL}/workspace/favorite/${id}`,
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

  const favoriteAppsData = await getFavoriteApps();

  if (!favoriteAppsData) {
    redirect("/server-not-found");
  }

  if (!favoriteAppsData?.success) {
    redirect("/");
  }

  return (
    <>
      {favoriteAppsData?.workspaces?.length === 0 && (
        <div className="bg-foreground/5 p-2 border border-foreground/20 rounded-sm text-xs border-dashed text-center">
          Your Favourite apps that you have saved
        </div>
      )}
      {favoriteAppsData?.workspaces?.map((workspace, index) => {
        return (
          <Link href={`/editor/${workspace?.id}`} key={index}>
            <Button
              className="flex gap-2 bg-transparent w-full font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
              variant="outline"
            >
              {workspace?.name?.length > 20
                ? workspace?.name?.slice(0, 20) + "..."
                : workspace?.name}
            </Button>
          </Link>
        );
      })}
    </>
  );
}
