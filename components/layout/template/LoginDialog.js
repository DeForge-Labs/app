"use client";

import { Button } from "@/components/ui/button";
import { LogIn, X } from "lucide-react";
import { Dialog, DialogPopup } from "@/components/ui/dialog";
import { useState } from "react";
import LoginForm from "../onboard/LoginForm";
import Logo from "@/components/ui/Logo";

export default function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleIsOpenChange = (open) => {
    if (isLoading) return;
    setIsOpen(open);
  };

  return (
    <>
      <Button
        className="text-xs gap-1.5 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
        onClick={() => setIsOpen(true)}
      >
        <LogIn />
        Sign In
      </Button>

      <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
        <DialogPopup
          className={
            "p-0 mt-20 sm:max-w-sm sm:rounded-lg bg-background border-transparent dark:before:shadow-none before:shadow-none flex flex-col items-center relative"
          }
          showCloseButton={false}
        >
          <div
            className="absolute bg-background rounded-full border border-foreground/30 p-1 -top-2 hover:bg-background/70 hover:cursor-pointer -right-2"
            onClick={() => {
              handleIsOpenChange(false);
            }}
          >
            <X className="size-3" />
          </div>

          <Logo
            size={60}
            className="absolute -top-28 left-1/2 -translate-x-1/2"
          />
          <div className="max-w-sm w-full -mt-10">
            <LoginForm onLoadingChange={setIsLoading} embedded />
          </div>
        </DialogPopup>
      </Dialog>
    </>
  );
}
