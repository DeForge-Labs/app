"use client"

import { Form as FormPrimitive } from "@base-ui-components/react/form"

import { cn } from "@/lib/utils"

function Form({
  className,
  ...props
}) {
  return (
    <FormPrimitive
      data-slot="form"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props} />
  );
}

export { Form }
