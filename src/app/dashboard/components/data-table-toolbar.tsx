import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { XIcon } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          id="search-locations"
          name="search-locations"
          type="search"
          placeholder="Filter Table..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-9 w-full max-w-[400px] lg:w-[350px]"
        />
        {table.getColumn("Location") && (
          <DataTableFacetedFilter
            column={table.getColumn("Location")}
            title="Location"
            paramKey="loc"
            options={[
              { label: "AFIESERE", value: "AFIESERE" },
              { label: "ERIEMU", value: "ERIEMU" },
              { label: "EVWRENI", value: "EVWRENI" },
              { label: "KOKORI", value: "KOKORI" },
              { label: "OLOMORO", value: "OLOMORO" },
              { label: "ORONI", value: "ORONI" },
              { label: "OWEH", value: "OWEH" },
              { label: "UZERE", value: "UZERE" },
              { label: "UZERE EAST", value: "UZERE EAST" },
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}

        <div className="flex gap-2 lg:ml-auto">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
