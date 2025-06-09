import * as React from "react";
import { Column } from "@tanstack/react-table";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Check, CirclePlus } from "lucide-react";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  paramKey?: string;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  paramKey = "loc", // Default to 'loc' for location
}: DataTableFacetedFilterProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  // Get all values for our param key from URL
  const getUrlValues = () => {
    return searchParams.getAll(paramKey);
  };

  // Sync from URL to filter state
  useEffect(() => {
    const urlValues = getUrlValues();
    if (urlValues.length > 0) {
      column?.setFilterValue(urlValues);
    } else if (selectedValues.size > 0) {
      // Clear if URL has no values but we have selected values
      column?.setFilterValue(undefined);
    }
  }, [searchParams]);

  // Sync from filter state to URL
  const updateUrlParams = (values: string[]) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    // Remove all existing params for our key
    currentParams.delete(paramKey);

    // Add new values
    values.forEach((value) => {
      currentParams.append(paramKey, value);
    });

    router.replace(`${pathname}?${currentParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterChange = (newValues: Set<string>) => {
    const filterValues = Array.from(newValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
    updateUrlParams(filterValues);
  };

  const clearFilters = () => {
    // Clear the column filter
    column?.setFilterValue(undefined);

    // Clear the URL parameter
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete(paramKey);

    // Preserve other query parameters
    const otherParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== paramKey) {
        otherParams.append(key, value);
      }
    });

    router.replace(`${pathname}?${otherParams.toString()}`, { scroll: false });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 border-dashed">
          <CirclePlus className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const newValues = new Set(selectedValues);
                      if (isSelected) {
                        newValues.delete(option.value);
                      } else {
                        newValues.add(option.value);
                      }
                      handleFilterChange(newValues);
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check
                        className={cn("h-4 w-4 text-primary-foreground")}
                      />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearFilters}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
