"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  LayoutTemplate,
  Loader2,
  Zap,
  Atom,
  Calendar,
  ChartLine,
  ClipboardList,
  Boxes,
  Database,
} from "lucide-react";
import useChangeIcon from "@/hooks/useChangeIcon";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";

export default function IconDialog({ appId, appIcon }) {
  const iconList = [
    {
      name: "layout-template",
      icon: <LayoutTemplate className="w-5 h-5" />,
    },
    {
      name: "zap",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      name: "atom",
      icon: <Atom className="w-5 h-5" />,
    },
    {
      name: "calendar",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      name: "chart-line",
      icon: <ChartLine className="w-5 h-5" />,
    },
    {
      name: "clipboard-list",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      name: "boxes",
      icon: <Boxes className="w-5 h-5" />,
    },
    {
      name: "database",
      icon: <Database className="w-5 h-5" />,
    },
  ];

  const {
    isOpen,
    setIsOpen,
    isChangingIcon,
    iconId,
    setIconId,
    handleChangeIcon,
  } = useChangeIcon();

  const handleIsOpenChange = (open) => {
    if (!isChangingIcon) {
      setIsOpen(open);
      setIconId(appIcon);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
      <DialogTrigger
        render={
          <button className="p-2 border border-foreground/15 bg-background rounded-sm hover:bg-foreground/5 cursor-pointer z-10">
            <DynamicIcon name={appIcon} className="w-5 h-5 opacity-70" />
          </button>
        }
      ></DialogTrigger>
      <DialogPopup className="sm:max-w-sm">
        <Form>
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Change Icon
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Choose an icon for your app.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            {iconList.map((icon) => (
              <Button
                key={icon.name}
                variant="outline"
                className={cn(
                  "p-2 border border-foreground/15 bg-background rounded-sm hover:bg-foreground/5 cursor-pointer z-10",
                  icon.name === iconId && "border-foreground"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setIconId(icon.name);
                }}
              >
                <DynamicIcon name={icon.name} className="w-5 h-5 opacity-70" />
              </Button>
            ))}
          </div>

          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" className="text-xs" />}
            >
              Cancel
            </DialogClose>
            <Button
              className="bg-foreground/90 text-background rounded-md border-none text-xs"
              onClick={() => {
                handleChangeIcon(appId);
              }}
              type="submit"
              disabled={isChangingIcon}
            >
              {isChangingIcon ? <Loader2 className="animate-spin" /> : "Change"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
