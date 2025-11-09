"use client";
import { CalendarDateTime } from "@internationalized/date";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";

export default function DateTimePicker({ value, onChange, isDisabled }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState("10:30:00");

  useEffect(() => {
    if (value) {
      const jsDate = new Date(
        value.year,
        value.month - 1,
        value.day,
        value.hour,
        value.minute,
        value.second
      );
      setDate(jsDate);

      const timeString = `${String(value.hour).padStart(2, "0")}:${String(
        value.minute
      ).padStart(2, "0")}:${String(value.second).padStart(2, "0")}`;
      setTime(timeString);
    }
  }, [value]);

  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) return;

    setDate(selectedDate);
    setOpen(false);

    const [hours, minutes, seconds] = time.split(":").map(Number);

    const newDateTime = new CalendarDateTime(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      selectedDate.getDate(),
      hours || 0,
      minutes || 0,
      seconds || 0
    );

    onChange?.(newDateTime);
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (!date) return;

    const [hours, minutes, seconds] = newTime.split(":").map(Number);

    const newDateTime = new CalendarDateTime(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      hours || 0,
      minutes || 0,
      seconds || 0
    );

    onChange?.(newDateTime);
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 flex flex-col gap-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date-picker"
                disabled={isDisabled}
                className="flex-1 text-[10px] gap-1 dark:not-disabled:not-active:not-data-pressed:before:shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none rounded-sm font-normal [&_svg:not([class*='size-'])]:size-3"
              >
                {date ? date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            }
          ></PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden [&>div]:p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              className="w-64"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={handleTimeChange}
          style={{ fontSize: "10px", textAlign: "center" }}
          disabled={isDisabled}
          className="rounded-sm [&>input]:px-1 h-full dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
