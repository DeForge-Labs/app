"use client";

import Image from "next/image";
import { checkIfLogin } from "@/actions/checkIfLoggedIn";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import useUseTemplate from "@/hooks/useUseTemplate";
import { useParams } from "next/navigation";

export default function OpenButton() {
  const [isOpen, setIsOpen] = useState(false);

  const params = useParams();

  const { isUsingTemplate, handleUseTemplate } = useUseTemplate(setIsOpen);

  const handleIsOpenChange = (open) => {
    if (!isUsingTemplate) {
      setIsOpen(open);
    }
  };
  return (
    <>
      <Button
        className="text-xs rounded-sm gap-1.5 px-3 [&_svg:not([class*='size-'])]:size-3 border border-foreground/50 shadow-[#8754ff] shadow-md"
        onClick={async () => {
          const isLoggedIn = await checkIfLogin();

          if (!isLoggedIn) {
            toast("Sign In to use this template");
            return;
          }

          handleIsOpenChange(true);
        }}
      >
        Open in{" "}
        <span>
          <Image
            src="/logo/logo-white.svg"
            alt="Deforge"
            width={14}
            height={14}
            className="dark:invert ml-[1px]"
          />
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
        <DialogPopup className="sm:max-w-sm">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleUseTemplate(params?.id);
            }}
          >
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Use Template
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Use this template to create a new app. This will create a copy
                of the template in your current team.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose
                render={<Button variant="ghost" className="text-xs" />}
              >
                Cancel
              </DialogClose>
              <Button
                className="text-background rounded-md border-none text-xs"
                disabled={isUsingTemplate}
                type="submit"
              >
                {isUsingTemplate ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Use Template"
                )}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
