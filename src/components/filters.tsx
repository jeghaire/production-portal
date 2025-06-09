"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useOptimistic, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SearchParams } from "@/lib/url-state";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { addDays, format, subDays } from "date-fns";

const formatToUrlDate = (date: Date): string => {
  return format(date, "dd-MM-yyyy");
};

const parseUrlDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const parts = dateString.split("-");
  if (parts.length !== 3) return undefined;

  // Create date in YYYY-MM-DD format which Date can parse reliably
  const isoFormat = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return new Date(isoFormat + "T00:00:00");
};

const LOCATIONS = [
  { label: "AFIESERE", value: "AFIESERE" },
  { label: "ERIEMU", value: "ERIEMU" },
  { label: "EVWRENI", value: "EVWRENI" },
  { label: "KOKORI", value: "KOKORI" },
  { label: "OLOMORO", value: "OLOMORO" },
  { label: "ORONI", value: "ORONI" },
  { label: "OWEH", value: "OWEH" },
  { label: "UZERE", value: "UZERE" },
];

interface FilterProps {
  searchParams: URLSearchParams;
}

function FilterBase({ searchParams }: FilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Get activeTab from URL or default to 'day'
  const activeTab = searchParams.get("tab") || "day";

  const initialFilters: SearchParams = {
    loc: searchParams.getAll("loc") || [],
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
    day: searchParams.get("day") || undefined,
  };

  const [optimisticFilters, setOptimisticFilters] =
    useOptimistic<SearchParams>(initialFilters);

  const updateURL = (newFilters: SearchParams) => {
    const searchParams = new URLSearchParams();

    // Always include the active tab
    searchParams.set("tab", activeTab);

    Object.entries(newFilters).forEach(([key, value]) => {
      // Skip undefined values and empty arrays
      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.set(key, value);
      }
    });

    const queryString = searchParams.toString();
    router.push(`/dashboard?${queryString}#chart`, { scroll: false });
  };

  const handleFilterChange = (
    filterType: keyof SearchParams,
    value: string[] | string | undefined
  ) => {
    startTransition(() => {
      const newFilters = {
        ...optimisticFilters,
        [filterType]: Array.isArray(value)
          ? value
          : value
            ? [value]
            : undefined,
      };
      setOptimisticFilters(newFilters);
      updateURL(newFilters);
    });
  };

  const handleDayDateChange = (date: Date | undefined) => {
    startTransition(() => {
      const newFilters = {
        ...optimisticFilters,
        day: date ? formatToUrlDate(date) : undefined,
        from: undefined, // Clear from when using day view
        to: undefined, // Clear to when using day view
      };
      setOptimisticFilters(newFilters);
      updateURL(newFilters);
    });
  };

  const handleRangeDateChange = (
    type: "from" | "to",
    date: Date | undefined
  ) => {
    startTransition(() => {
      const newFilters = {
        ...optimisticFilters,
        [type]: date ? formatToUrlDate(date) : undefined,
        day: undefined, // Clear date when using range view
      };
      setOptimisticFilters(newFilters);
      updateURL(newFilters);
    });
  };

  const handleListToggle = (loc: string) => {
    startTransition(() => {
      const currentlocs = optimisticFilters.loc || [];
      let updatedlocs: string[];

      if (currentlocs.includes(loc)) {
        updatedlocs = currentlocs.filter((l) => l !== loc);
      } else {
        updatedlocs = [...currentlocs, loc];
      }

      handleFilterChange("loc", updatedlocs.length ? updatedlocs : undefined);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      setOptimisticFilters({});
      router.push("/dashboard");
    });
  };

  const dayDate = optimisticFilters.day
    ? parseUrlDate(optimisticFilters.day)
    : undefined;
  const fromDate = optimisticFilters.from
    ? parseUrlDate(optimisticFilters.from)
    : undefined;
  const toDate = optimisticFilters.to
    ? parseUrlDate(optimisticFilters.to)
    : undefined;

  return (
    <div
      data-pending={isPending ? "" : undefined}
      className="flex-shrink-0 flex flex-col h-full"
    >
      {/* Date Range Filter - Only shown for 'range' tab */}
      {activeTab === "range" && (
        <div className="flex p-2 gap-3 flex-wrap">
          <div className="flex flex-col flex-1 space-y-1">
            <Label className="text-sm w-fit">Start Date</Label>
            <Popover modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full max-w-[170] text-left text-sm font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  {fromDate ? (
                    format(fromDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[100]" align="start">
                <Calendar
                  mode="single"
                  defaultMonth={fromDate}
                  selected={fromDate}
                  onSelect={(date) => handleRangeDateChange("from", date)}
                  disabled={(date) => {
                    const minDate = new Date("2024-12-31");
                    const maxDate = new Date();
                    if (date < minDate || date > maxDate) return true;
                    if (toDate && date > subDays(toDate, 1)) return true;
                    return false;
                  }}
                  captionLayout="dropdown-months"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col flex-1 space-y-1">
            <Label className="text-sm w-fit">End Date</Label>
            <Popover modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full max-w-[170] text-left text-sm font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-100" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  defaultMonth={toDate}
                  onSelect={(date) => handleRangeDateChange("to", date)}
                  disabled={(date) => {
                    const minDate = new Date("2024-12-31");
                    const maxDate = new Date();
                    if (date < minDate || date > maxDate) return true;
                    if (fromDate && date < addDays(fromDate, 1)) return true;
                    return false;
                  }}
                  captionLayout="dropdown-months"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Single Date Picker - Only shown for 'day' tab */}
      {activeTab === "day" && (
        <div className="p-2">
          <div className="flex flex-col space-y-1">
            <Label className="text-sm w-fit">Date</Label>
            <Popover modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full max-w-[170] text-left text-sm font-normal",
                    !dayDate && "text-muted-foreground"
                  )}
                >
                  {dayDate ? format(dayDate, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[100]" align="start">
                <Calendar
                  mode="single"
                  selected={dayDate}
                  defaultMonth={dayDate}
                  onSelect={(date) => handleDayDateChange(date)}
                  captionLayout="dropdown-months"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Location Filter - Shown for both tabs */}
      <div className="h-[300px] mt-2 p-2">
        <Label className="text-sm mb-2">Locations</Label>
        <div className="flex items-center space-x-2 py-1">
          <Checkbox
            id="list-all"
            checked={optimisticFilters.loc?.length === LOCATIONS.length}
            onCheckedChange={() => {
              const allSelected =
                optimisticFilters.loc?.length === LOCATIONS.length;
              const newLocs = allSelected
                ? undefined
                : LOCATIONS.map((l) => l.value);
              handleFilterChange("loc", newLocs);
            }}
          />
          <Label htmlFor="list-all">ALL LOCATIONS</Label>
        </div>

        {LOCATIONS.map((list) => (
          <div key={list.label} className="flex items-center space-x-2 py-1">
            <Checkbox
              id={`list-${list.label.toLowerCase()}`}
              checked={optimisticFilters.loc?.includes(list.value) || false}
              onCheckedChange={() => handleListToggle(list.value)}
            />
            <Label htmlFor={`list-${list.label.toLowerCase()}`}>
              {list.label}
            </Label>
          </div>
        ))}
      </div>

      {Object.keys(optimisticFilters).length > 0 && (
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearFilters}
          >
            Reset all filters
          </Button>
        </div>
      )}
    </div>
  );
}

export function FilterFallback() {
  return <FilterBase searchParams={new URLSearchParams()} />;
}

export function Filter() {
  const searchParams = useSearchParams();
  return <FilterBase searchParams={searchParams} />;
}
