"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui-components/react/menu"
import { CheckIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Menu = MenuPrimitive.Root

const MenuPortal = MenuPrimitive.Portal

function MenuTrigger(props) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

function MenuPopup({
  className,
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  ...props
}) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        data-slot="menu-positioner"
        className="z-50"
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}>
        <span
          className="relative flex origin-(--transform-origin) rounded-lg bg-popover bg-clip-padding shadow-lg transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] has-data-starting-style:scale-98 has-data-starting-style:opacity-0 dark:bg-clip-border dark:before:shadow-[0_-1px_--theme(--color-white/8%)]">
          <MenuPrimitive.Popup
            data-slot="menu-popup"
            className={cn("max-h-(--available-height) min-w-32 overflow-y-auto p-1", className)}
            {...props} />
        </span>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function MenuGroup(props) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

function MenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1 text-base outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-64 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-inset:ps-8 data-[variant=destructive]:text-destructive-foreground sm:text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props} />
  );
}

function MenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      className={cn(
        "grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] data-disabled:pointer-events-none data-disabled:opacity-64 data-highlighted:bg-accent data-highlighted:text-accent-foreground sm:text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}>
      <MenuPrimitive.CheckboxItemIndicator className="col-start-1">
        <CheckIcon />
      </MenuPrimitive.CheckboxItemIndicator>
      <span className="col-start-2">{children}</span>
    </MenuPrimitive.CheckboxItem>
  );
}

function MenuRadioGroup(props) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />;
}

function MenuRadioItem({
  className,
  children,
  ...props
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(
        "grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] data-disabled:pointer-events-none data-disabled:opacity-64 data-highlighted:bg-accent data-highlighted:text-accent-foreground sm:text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}>
      <MenuPrimitive.RadioItemIndicator className="col-start-1">
        <CheckIcon />
      </MenuPrimitive.RadioItemIndicator>
      <span className="col-start-2">{children}</span>
    </MenuPrimitive.RadioItem>
  );
}

function MenuGroupLabel({
  className,
  inset,
  ...props
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:ps-9 sm:data-inset:ps-8",
        className
      )}
      {...props} />
  );
}

function MenuSeparator({
  className,
  ...props
}) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("mx-2 my-1 h-px bg-border", className)}
      {...props} />
  );
}

function MenuShortcut({
  className,
  ...props
}) {
  return (
    <span
      data-slot="menu-shortcut"
      className={cn("ms-auto text-xs tracking-widest text-muted-foreground/64", className)}
      {...props} />
  );
}

function MenuSub(props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-sub" {...props} />;
}

function MenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex items-center gap-2 rounded-sm px-2 py-1 text-base outline-none data-disabled:pointer-events-none data-disabled:opacity-64 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-inset:ps-8 sm:text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}>
      {children}
      <ChevronRightIcon className="ms-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function MenuSubPopup({
  className,
  sideOffset = 0,
  alignOffset = -4,
  align = "start",
  ...props
}) {
  return (
    <MenuPopup
      className={className}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      data-slot="menu-sub-content"
      {...props} />
  );
}

export {
  Menu,
  Menu as DropdownMenu,
  MenuPortal,
  MenuPortal as DropdownMenuPortal,
  MenuTrigger,
  MenuTrigger as DropdownMenuTrigger,
  MenuPopup,
  MenuPopup as DropdownMenuContent,
  MenuGroup,
  MenuGroup as DropdownMenuGroup,
  MenuItem,
  MenuItem as DropdownMenuItem,
  MenuCheckboxItem,
  MenuCheckboxItem as DropdownMenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioGroup as DropdownMenuRadioGroup,
  MenuRadioItem,
  MenuRadioItem as DropdownMenuRadioItem,
  MenuGroupLabel,
  MenuGroupLabel as DropdownMenuLabel,
  MenuSeparator,
  MenuSeparator as DropdownMenuSeparator,
  MenuShortcut,
  MenuShortcut as DropdownMenuShortcut,
  MenuSub,
  MenuSub as DropdownMenuSub,
  MenuSubTrigger,
  MenuSubTrigger as DropdownMenuSubTrigger,
  MenuSubPopup,
  MenuSubPopup as DropdownMenuSubContent,
}
