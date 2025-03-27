"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  SearchParams,
  parseSearchParams,
  stringifySearchParams,
} from "@/lib/url-state";

const LOCATIONS = [
  { label: "AFIESERE", value: "AFIESERE" },
  { label: "ERIEMU", value: "ERIEMU" },
  { label: "EVWRENI", value: "EVWRENI" },
  { label: "KOKORI", value: "KOKORI" },
  { label: "OLOMORO", value: "OLOMORO" },
  { label: "ORONI", value: "ORONI" },
  { label: "OWEH", value: "OWEH" },
  { label: "UZERE WEST", value: "UZERE WEST" },
];

interface FilterProps {
  searchParams: URLSearchParams;
}

function FilterBase({ searchParams }: FilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialFilters = parseSearchParams(Object.fromEntries(searchParams));
  const [optimisticFilters, setOptimisticFilters] =
    useOptimistic<SearchParams>(initialFilters);

  const updateURL = (newFilters: SearchParams) => {
    const queryString = stringifySearchParams(newFilters);
    router.push(
      queryString ? `/dashboard/report?${queryString}` : "/dashboard/report"
    );
  };

  const handleFilterChange = (
    filterType: keyof SearchParams,
    value: string | undefined
  ) => {
    startTransition(() => {
      const newFilters = { ...optimisticFilters, [filterType]: value };
      setOptimisticFilters(newFilters);
      updateURL(newFilters);
    });
  };

  const handleListToggle = (locs: string) => {
    startTransition(() => {
      const newlocs = locs.split(",");
      const currentlocs = optimisticFilters.loc?.split(",") || [];

      // If the first loc of the list is already in the filter, remove all locs of this list
      if (currentlocs.includes(newlocs[0])) {
        const updatedlocs = currentlocs.filter((loc) => !newlocs.includes(loc));
        handleFilterChange("loc", updatedlocs.join(",") || undefined);
      } else {
        // Otherwise, replace all current locs with the new list
        handleFilterChange("loc", locs);
      }
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      setOptimisticFilters({});
      router.push("/dashboard/report");
    });
  };

  return (
    <div
      data-pending={isPending ? "" : undefined}
      className="flex-shrink-0 flex flex-col h-full"
    >
      <ScrollArea className="flex-grow">
        <div className="p-2 space-y-4">
          <div>
            <Label htmlFor="year-range">Production Year</Label>
            <Slider
              id="year-range"
              min={1950}
              max={2025}
              step={10}
              value={[Number(optimisticFilters.yr) || 2025]}
              onValueChange={([value]) =>
                handleFilterChange("yr", value.toString())
              }
              className="mt-2"
            />
            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
              <span>1950</span>
              <span>{optimisticFilters.yr || 2025}</span>
            </div>
          </div>

          <div>
            <Label>Locations</Label>
            <ScrollArea className="h-[200px] mt-2">
              {LOCATIONS.map((list) => (
                <div
                  key={list.label}
                  className="flex items-center space-x-2 py-1"
                >
                  <Checkbox
                    id={`list-${list.label.toLowerCase()}`}
                    checked={
                      optimisticFilters.loc?.split(",")[0] ===
                      list.value.split(",")[0]
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
