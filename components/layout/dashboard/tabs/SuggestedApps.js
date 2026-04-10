import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Github, Send, Slack } from "lucide-react";

const apps = [
  {
    name: "Telegram",
    icon: <Send className="size-6" />,
    description: "Connect your Telegram to Deforge and listen for new messages",
    searchterm: "Telegram",
  },
  {
    name: "Slack",
    icon: <Slack className="size-6" />,
    description: "Connect your Slack to Deforge and manage your workspace",
    searchterm: "Slack",
  },
  {
    name: "Discord",
    icon: (
      <Image
        src="/logo/discord.svg"
        alt="discord"
        width={40}
        height={40}
        className="dark:invert"
      />
    ),
    description:
      "Connect your Discord server to Deforge and automate your server tasks",
    searchterm: "Discord",
  },
  {
    name: "GitHub",
    icon: <Github className="size-6" />,
    description: "Connect your GitHub to Deforge and manage your repositories",
    searchterm: "GitHub",
  },
  {
    name: "Airtable",
    icon: (
      <Image
        src="/logo/airtable.svg"
        alt="airtable"
        width={40}
        height={40}
        className="not-dark:invert"
      />
    ),
    description: "Connect your Airtable to Deforge and manage your bases",
    searchterm: "Airtable",
  },
  {
    name: "Hubspot",
    icon: (
      <Image
        src="/logo/hubspot.svg"
        alt="hubspot"
        width={40}
        height={40}
        className="not-dark:invert"
      />
    ),
    description: "Connect your Hubspot to Deforge and manage your contacts",
    searchterm: "Hubspot",
  },
];

export default function SuggestedApps() {
  return (
    <div className="max-w-[1390px] w-full flex flex-col gap-4 z-20 mt-20">
      <div className="flex w-full justify-between lg:items-center flex-col gap-2 lg:flex-row">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Suggested Apps</p>
          <p className="text-xs text-foreground/60">
            Check out these integrations that can help you automate your work
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {apps.map((app, index) => (
          <Link key={index} href={`/templates?q=${app.searchterm}`}>
            <Card className="hover:border hover:border-foreground/20 h-full cursor-pointer">
              <CardHeader className={"-mb-1"}>
                <CardTitle className="text-sm font-semibold flex gap-3">
                  <div className="rounded-sm p-4 bg-foreground/10 flex items-center justify-center h-16 w-16 min-w-16">
                    {app.icon}
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <p className="text-sm font-semibold">{app.name}</p>{" "}
                    <p className="text-xs font-normal text-foreground/60 line-clamp-3">
                      {app.description}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
