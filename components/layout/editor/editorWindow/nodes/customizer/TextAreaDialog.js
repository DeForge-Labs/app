"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import TypeBadge from "./common/TypeBadge";
import { X } from "lucide-react";

export default function TextAreaDialog({
  isOpen,
  onClose,
  value,
  onChange,
  placeholder,
  field,
  nodeType,
  isInput,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className={"p-2 gap-1"}>
        <div className="flex justify-between items-center">
          <div className="text-xs font-medium text-foreground/80 capitalize flex items-center gap-1">
            {field.name}
            {isInput && (
              <TypeBadge
                type={nodeType.inputs.find((i) => i.name === field.name)?.type}
              />
            )}
          </div>

          <div
            className="z-20 p-1 hover:bg-foreground/5 rounded-sm cursor-pointer"
            onClick={onClose}
          >
            <X className="size-3" />
          </div>
        </div>
        <DialogDescription>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="mt-0.5 rounded-sm dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
            variant="outline"
            rows={8}
            style={{ fontSize: "12px" }}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
