"use client";

import Image from "next/image";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Users } from "lucide-react";

export default function TemplateNavbar() {
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  return (
    <header className="sticky top-0 z-10 border-b border-black/50 bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Image src="/logo/logo-black.svg" alt="Logo" width={22} height={22} />
          <span className="font-bold inline-block text-2xl">Deforge</span>
        </div>

        <div className="flex items-center gap-2">
          {!user && (
            <Button
              variant="outline"
              size="md"
              className="bg-black/80 h-9 rounded-lg text-background text-xs"
              onPress={() => {
                router.push(`/`);
              }}
            >
              Get Started
            </Button>
          )}
          {user && (
            <Button
              variant="outline"
              size="md"
              className="bg-black/80 h-9 rounded-lg text-background text-xs"
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
