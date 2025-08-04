"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  GlobalFilterTableState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";

function customGlobalFilterFn(row: any, columnId: string, filterValue: string) {
  const value = row.getValue(columnId);

  // Normalize date columns to DD/MM/YYYY for global search
  if (columnId === "Date" && typeof value === "string") {
    const dateObj = new Date(value);
    if (!isNaN(dateObj.getTime())) {
      const formatted = `${String(dateObj.getDate()).padStart(2, "0")}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${dateObj.getFullYear()}`;
      return rankItem(formatted, filterValue).passed;
    }
    return rankItem(value, filterValue).passed;
  }

  // Default fuzzy search for other columns
  return rankItem(String(value), filterValue).passed;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const { columns, data } = props;
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] =
    React.useState<GlobalFilterTableState>();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // --- Two-way sync for location filter and loc URL param ---
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Map between column name and URL param
  const columnParamMap: Record<string, string> = {
    Location: "loc",
    // Add more mappings here if needed
  };
  const paramColumnMap = Object.fromEntries(
    Object.entries(columnParamMap).map(([col, param]) => [param, col])
  );

  // Sync from URL param to table filter
  React.useEffect(() => {
    // For each param in paramColumnMap, update the corresponding column filter
    let changed = false;
    const newFilters = [...columnFilters];
    Object.entries(paramColumnMap).forEach(([param, col]) => {
      const urlValues = searchParams.getAll(param);
      const filterIdx = newFilters.findIndex((f) => f.id === col);
      if (urlValues.length > 0) {
        if (
          filterIdx === -1 ||
          JSON.stringify(newFilters[filterIdx].value) !==
            JSON.stringify(urlValues)
        ) {
          if (filterIdx === -1) {
            newFilters.push({ id: col, value: urlValues });
          } else {
            newFilters[filterIdx] = { id: col, value: urlValues };
          }
          changed = true;
        }
      } else if (filterIdx !== -1) {
        newFilters.splice(filterIdx, 1);
        changed = true;
      }
    });
    if (changed) setColumnFilters(newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Sync from table filter to URL param (only update loc param, preserve others like tab)
  // Debounce router.replace for URL param sync
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    let locChanged = false;

    Object.entries(columnParamMap).forEach(([col, param]) => {
      const filter = columnFilters.find((f) => f.id === col);
      const prevValues = searchParams.getAll(param);
      const newValues = Array.isArray(filter?.value) ? filter!.value : [];

      if (JSON.stringify(prevValues) !== JSON.stringify(newValues)) {
        currentParams.delete(param);
        newValues.forEach((v: string) => currentParams.append(param, v));
        locChanged = true;
      }
    });

    if (locChanged) {
      const newUrl = `${pathname}?${currentParams.toString()}`;
      if (window.location.search !== `?${currentParams.toString()}`) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          router.replace(newUrl, { scroll: false });
        }, 300); // 300ms debounce
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize: 8 },
    },
    enableRowSelection: true,
    globalFilterFn: customGlobalFilterFn,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border dark:border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
