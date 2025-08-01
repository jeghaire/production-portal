"use client";

import * as React from "react";
import { format, subDays } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_DATE = new Date(2025, 12, 31); // March 31, 2025

export default function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  const handlePresetChange = (value: string) => {
    const now = new Date();
    let from: Date | undefined = undefined;

    switch (value) {
      case "7":
        from = subDays(now, 7);
        break;
      case "30":
        from = subDays(now, 30);
        break;
      case "90":
        from = subDays(now, 90);
        break;
      case "custom":
      default:
        from = undefined;
    }

    if (from) {
      setDate({ from, to: now > MAX_DATE ? MAX_DATE : now });
    }
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setDate(range);
  };

  const handleClear = () => {
    setDate(undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-fit justify-start text-left font-normal text-xs",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="mb-3 flex items-center justify-between">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Quick select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Past week</SelectItem>
                <SelectItem value="30">Past month</SelectItem>
                <SelectItem value="90">Past 3 months</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {date && (
              <Button variant="ghost" size="icon" onClick={handleClear}>
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
            disabled={{ after: MAX_DATE }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
