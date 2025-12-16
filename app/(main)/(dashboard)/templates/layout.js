import { Globe } from "lucide-react";
import SwitchTemplateType from "@/components/layout/dashboard/templates/SwitchTemplateType";
import { headers } from "next/headers";
import Image from "next/image";
import FeedbackDialog from "@/components/layout/dashboard/navbar/FeedbackDialog";
import SettingsMenu from "@/components/layout/dashboard/navbar/SettingsMenu";
import LoginDialog from "@/components/layout/template/LoginDialog";
import Link from "next/link";

export default async function TemplateLayout({ children }) {
  const headersList = await headers();
  const userStatus = headersList.get("x-user-status");

  const isLoggedIn = userStatus === "active";

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-4 border-b border-foreground/15">
        {isLoggedIn && (
          <div className="flex gap-2">
            <Globe size={14} className="mt-1" />

            <div className="flex flex-col gap-0.5">
              <h1 className="text-sm font-medium">Templates</h1>
              <p className="text-xs text-foreground/50">
                Choose from pre-built templates to get started
              </p>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="flex gap-3">
            <Link href={"https://deforge.io"} className="flex items-center">
              <Image
                src="/logo/logo-black.svg"
                alt="Deforge Logo"
                width={28}
                height={28}
                className="dark:invert"
              />
            </Link>

            <div className="flex flex-col gap-0.5">
              <h1 className="text-sm font-medium">Deforge Templates</h1>
              <p className="text-xs text-foreground/50">
                Choose from pre-built templates to get started
              </p>
            </div>
          </div>
        )}

        {isLoggedIn && <SwitchTemplateType />}

        {!isLoggedIn && (
          <div className="flex items-center gap-2">
            <FeedbackDialog />
            <SettingsMenu isTemplate />
            <LoginDialog />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
