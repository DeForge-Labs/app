"use client";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { Copy, Pen, Star, Trash } from "lucide-react";
import { useState } from "react";
import RenameDialog from "./RenameDialog";
import DuplicateDialog from "./DuplicateDialog";
import DeleteDialog from "./DeleteDialog";
import useFavoriteWorkspace from "@/hooks/useFavoriteWorkspace";

export default function MenuBox({ appId, appName, isFavorite }) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);

  const { handleFavoriteWorkflow } = useFavoriteWorkspace();
  return (
    <>
      <RenameDialog
        isOpen={isRenameDialogOpen}
        setIsOpen={setIsRenameDialogOpen}
        appId={appId}
        appName={appName}
      />

      <DuplicateDialog
        isOpen={isDuplicateDialogOpen}
        setIsOpen={setIsDuplicateDialogOpen}
        appId={appId}
        appName={appName}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        appId={appId}
      />

      <Menu>
        <MenuTrigger
          render={
            <Button
              variant="outline"
              className="flex gap-2 bg-transparent font-normal px-1 min-h-4 !pointer-coarse:after:min-h-4 h-5 w-fit z-10 shadow-none! [:hover,[data-pressed]]:bg-foreground/5 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60 border border-foreground/15"
            />
          }
        ></MenuTrigger>

        <MenuPopup
          align="end"
          sideOffset={5}
          className="border border-foreground/30 rounded-lg w-40"
        >
          <Button
            variant="outline"
            onClick={() => setIsRenameDialogOpen(true)}
            className="data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent shadow-none! bg-transparent hover:bg-transparent w-full justify-start border-none"
          >
            <Pen className="w-4 h-4" /> Rename
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsDuplicateDialogOpen(true)}
            className="data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent shadow-none! bg-transparent hover:bg-transparent w-full justify-start border-none"
          >
            <Copy className="w-4 h-4" /> Duplicate
          </Button>
          {isFavorite ? (
            <MenuItem
              onClick={() => handleFavoriteWorkflow(appId, "no")}
              className={
                "text-xs sm:text-xs [&_svg:not([class*='size-'])]:size-3 cursor-pointer"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-star-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
              </svg>{" "}
              Unfavorite
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => handleFavoriteWorkflow(appId, "yes")}
              className={
                "text-xs sm:text-xs [&_svg:not([class*='size-'])]:size-3 cursor-pointer"
              }
            >
              <Star className="w-4 h-4" /> Favorite
            </MenuItem>
          )}
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent shadow-none! bg-transparent hover:bg-transparent w-full justify-start border-none"
          >
            <Trash className="w-4 h-4" /> Delete
          </Button>
        </MenuPopup>
      </Menu>
    </>
  );
}
