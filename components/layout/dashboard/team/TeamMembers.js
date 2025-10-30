import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Menu, MenuPopup, MenuTrigger } from "@/components/ui/menu";
import ChangeRoleButton from "./ChangeRoleButton";
import RemoveMemberButton from "./RemoveMemberButton";

export default async function TeamMembers({ id }) {
  const getTeamMembers = async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(
        `${process.env.API_URL}/team/members/${id}`,
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

  const teamMembersData = await getTeamMembers();

  if (!teamMembersData) {
    redirect("/server-not-found");
  }

  if (!teamMembersData?.success) {
    redirect("/");
  }

  const members = teamMembersData?.members;

  const isSelfOwner = members?.find(
    (member) => member?.isOwner && member?.isSelf
  );

  return (
    <>
      {members?.map((member, index) => {
        const timeAgo = formatDistanceToNow(member.joinedAt, {
          addSuffix: true,
        });

        return (
          <div
            className="flex flex-col gap-2 border w-full border-foreground/15 rounded-sm p-4 bg-foreground/2 hover:shadow-sm transition-shadow shadow-foreground/10 max-w-[1360px]"
            key={index}
          >
            <div className="flex flex-col gap-0.5">
              <p className="font-medium text-sm">{member?.user?.name}</p>

              <p className="text-xs">Joined {timeAgo}</p>
            </div>

            <Separator className="my-2 bg-foreground/15" />

            <div className="flex justify-between items-center -mt-2 -mb-1">
              <div className="flex gap-2 items-center">
                <Badge className="text-[10px] px-1 py-0.5 bg-foreground/10 text-foreground/70 capitalize">
                  {member?.role?.toLowerCase()}
                </Badge>
                {member?.isOwner && (
                  <Badge className="text-[10px] px-1 py-0.5 bg-foreground/10 text-foreground/70">
                    Owner
                  </Badge>
                )}
              </div>

              {isSelfOwner && (
                <div className="flex gap-2 items-center">
                  {!member?.isSelf && (
                    <Menu>
                      <MenuTrigger
                        render={
                          <Button
                            className="flex gap-2 bg-transparent font-normal w-full px-1 min-h-4 !pointer-coarse:after:min-h-4 h-5  !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60 border border-foreground/15"
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
                        <ChangeRoleButton member={member} />
                        <RemoveMemberButton member={member} />
                      </MenuPopup>
                    </Menu>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
