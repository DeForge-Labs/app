"use client";

import Image from "next/image";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Users } from "lucide-react";
import ThemeChanger from "../dashboard/ThemeChanger";
import GetStartedButton from "./GetStartedButton";

export default function TemplateNavbar() {
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  return (
    <header className="sticky top-0 z-10">
      <div className="max-w-5xl px-8 mx-auto flex h-16 items-center justify-between py-10 border border-t-0 rounded-xl rounded-t-none border-black/50 bg-background dark:bg-dark dark:border-background">
        <div className="flex items-center gap-2">
          <Image
            src="/logo/logo-black.svg"
            alt="Logo"
            width={22}
            height={22}
            className="dark:invert"
          />
          <span className="font-bold inline-block text-2xl dark:text-background">
            Deforge
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeChanger />
          {!user && <GetStartedButton />}
          {user && (
            <Button
              variant="outline"
              size="md"
              className="bg-black/80 h-9 rounded-lg text-background text-xs dark:bg-background dark:text-black"
              onPress={() => {
                router.push(`/team`);
              }}
            >
              <Users size={16} />
              Teams
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
