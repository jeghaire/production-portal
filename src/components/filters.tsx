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

const YEARS = ["2025", "2024"];

interface FilterProps {
  searchParams: URLSearchParams;
}

function FilterBase({ searchParams }: FilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialFilters: SearchParams = {
    loc: searchParams.getAll("loc") || [],
    yr: searchParams.get("yr") || undefined,
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
    router.push(queryString ? `/dashboard?${queryString}` : "/dashboard");
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
      <div className="p-2 flex flex-col space-y-2">
        <Label htmlFor="year">Chosen Year</Label>
        <Select
          value={optimisticFilters.yr || "2025"}
          onValueChange={(value) => handleFilterChange("yr", value)}
        >
          <SelectTrigger id="year" className="mt-2">
            <SelectValue placeholder="Select a Year" />
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

      <ScrollArea className="flex-grow mt-4">
        <div className="p-2 space-y-4">
          <div>
            <Label>Locations</Label>
            <ScrollArea className="h-[220px] mt-2">
              {LOCATIONS.map((list) => (
                <div
                  key={list.label}
                  className="flex items-center space-x-2 py-1"
                >
                  <Checkbox
                    id={`list-${list.label.toLowerCase()}`}
                    checked={
                      optimisticFilters.loc?.includes(list.value) || false
                    }
                    onCheckedChange={() => handleListToggle(list.value)}
                  />
                  <Label htmlFor={`list-${list.label.toLowerCase()}`}>
                    {list.label}
                  </Label>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </ScrollArea>

      {Object.keys(optimisticFilters).length > 0 && (
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearFilters}
          >
            Clear all filters
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
