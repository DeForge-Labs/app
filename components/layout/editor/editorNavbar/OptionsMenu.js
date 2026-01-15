import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import ThemeRadioButtons from "../../dashboard/navbar/ThemeRadioButtons";
import { useState } from "react";
import ExportDialog from "./ExportDialog";
import ImportDialog from "./ImportDialog";
import PublishDialog from "./PublishDialog";

export default function OptionsMenu() {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  return (
    <>
      <PublishDialog isOpen={isPublishOpen} setIsOpen={setIsPublishOpen} />
      <ExportDialog open={isExportOpen} setIsOpen={setIsExportOpen} />
      <ImportDialog open={isImportOpen} setIsOpen={setIsImportOpen} />
      <Menu>
        <MenuTrigger
          render={
            <Button
              variant="outline"
              className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
            >
              <Ellipsis />
            </Button>
          }
        ></MenuTrigger>
        <MenuPopup
          className="w-[200px] border border-foreground/30 rounded-lg"
          align="end"
          sideOffset={9}
        >
          <MenuGroup>
            <MenuGroupLabel>App Actions</MenuGroupLabel>

            <MenuItem
              className="cursor-pointer"
              onClick={() => setIsPublishOpen(true)}
            >
              Publish
            </MenuItem>

            <MenuItem
              className="cursor-pointer"
              onClick={() => setIsImportOpen(true)}
            >
              Import
            </MenuItem>

            <MenuItem
              className="cursor-pointer"
              onClick={() => setIsExportOpen(true)}
            >
              Export
            </MenuItem>
          </MenuGroup>
          <MenuSeparator className="bg-foreground/10 mt-1" />

          <MenuGroup>
            <MenuGroupLabel>Quick Links</MenuGroupLabel>
            <Link href={"/billing"}>
              <MenuItem className="cursor-pointer">
                Billing <ExternalLink className="ms-auto" />
              </MenuItem>
            </Link>
            <Link href={"https://docs.deforge.io"} target="_blank">
              <MenuItem className="cursor-pointer">
                Documentation <ExternalLink className="ms-auto" />
              </MenuItem>
            </Link>
            <Link href={"https://forum.deforge.io"} target="_blank">
              <MenuItem className="cursor-pointer">
                Community Forum <ExternalLink className="ms-auto" />
              </MenuItem>
            </Link>
          </MenuGroup>
          <MenuSeparator className="bg-foreground/10 mt-1" />

          <MenuGroup>
            <MenuGroupLabel>Theme</MenuGroupLabel>
            <ThemeRadioButtons />
          </MenuGroup>
        </MenuPopup>
      </Menu>
    </>
  );
}
