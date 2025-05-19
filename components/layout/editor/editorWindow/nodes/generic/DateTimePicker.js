"use client";

import { DatePicker } from "@heroui/react";

export default function DateTimePicker({ value, onChange, isDisabled }) {
  return (
    <DatePicker
      granularity="minute"
      className="max-w-xs"
      classNames={{
        base: "rounded-lg [&>div]:rounded-lg border border-black [&>div]:focus-within:hover:bg-transparent",
        inputWrapper: "bg-transparent",
      }}
      color="secondary"
      calendarProps={{
        classNames: {
          headerWrapper: "bg-background",
          header: "[&>span]:text-black",
          gridHeader: "bg-background",
          gridHeaderCell: "text-black/60",
          base: "border border-black rounded-xl bg-background overflow-hidden text-black",
          cell: "[&>span]:text-black [&>span]:hover:text-black",
          cellSelected: "[&>span]:text-white [&>span]:bg-black",
          cellToday: "border-black",
          cellDisabled: "[&>span]:text-black/50",
          nextButton: "text-black",
          prevButton: "text-black",
        },
      }}
      timeInputProps={{
        color: "secondary",
        classNames: {
          input: "rounded-xl border border-black",
          base: "text-black [&>div]:text-black [&>div]:rounded-lg [&>div]:border [&>div]:border-black [&>div]:focus-within:hover:bg-background",
          label: "text-black",
        },
      }}
      isDisabled={isDisabled}
      value={value}
      onChange={onChange}
    />
  );
}
