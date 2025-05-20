"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SearchParams } from "@/lib/url-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOCATIONS = [
  { label: "AFIESERE", value: "AFIESERE" },
  { label: "ERIEMU", value: "ERIEMU" },
  { label: "EVWRENI", value: "EVWRENI" },
  { label: "KOKORI", value: "KOKORI" },
  { label: "OLOMORO", value: "OLOMORO" },
  { label: "ORONI", value: "ORONI" },
  { label: "OWEH", value: "OWEH" },
  { label: "UZERE", value: "UZERE" },
  { label: "UZERE EAST", value: "UZERE EAST" },
];

const YEARS = ["2025"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface FilterProps {
  searchParams: URLSearchParams;
}

function FilterBase({ searchParams }: FilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialFilters: SearchParams = {
    loc: searchParams.getAll("loc") || [],
    yr: searchParams.get("yr") || undefined,
    mnt: searchParams.get("mnt") || undefined,
    // Add other filters as needed
  };

  const [optimisticFilters, setOptimisticFilters] =
    useOptimistic<SearchParams>(initialFilters);

  const updateURL = (newFilters: SearchParams) => {
    const searchParams = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value) {
        searchParams.set(key, value);
      }
    });

    const queryString = searchParams.toString();
    router.push(
      queryString ? `/dashboard?${queryString}#chart` : "/dashboard#chart"
    );
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

  return (
    <div
      data-pending={isPending ? "" : undefined}
      className="flex-shrink-0 flex flex-col h-full"
    >
      <div className="flex flex-wrap">
        <div className="p-2 flex flex-col space-y-1">
          <Label htmlFor="year">Year</Label>
          <Select
            value={optimisticFilters.yr ?? ""}
            // value={optimisticFilters.yr || "2025"}
            onValueChange={(value) => handleFilterChange("yr", value)}
          >
            <SelectTrigger id="year" className="mt-1">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((yr) => (
                <SelectItem key={yr} value={yr}>
                  {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="p-2 flex flex-col space-y-1">
          <Label htmlFor="month">Month</Label>
          <Select
            value={optimisticFilters.mnt ?? ""}
            // value={optimisticFilters.mnt || MONTHS[new Date().getMonth()]}
            onValueChange={(value) => handleFilterChange("mnt", value)}
          >
            <SelectTrigger id="month" className="mt-1">
              <SelectValue placeholder="Select a month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((mnt) => (
                <SelectItem key={mnt} value={mnt}>
                  {mnt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[300px] mt-2 p-2 space-y-4">
        <Label className="mb-2">Locations</Label>
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
      </ScrollArea>

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
