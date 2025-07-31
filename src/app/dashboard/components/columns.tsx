"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { z } from "zod";

export const ProductionDataSchema = z.object({
  date: z.string(),
  stringsUp: z.number(),
  gross: z.number(),
  net: z.number(),
  bsw: z.number(),
  location: z.string(),
});

type ProductionData = z.infer<typeof ProductionDataSchema>;

export const columns: ColumnDef<ProductionData>[] = [
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Location",
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      return (
        <span>{(row.getValue("Location") as string).toLocaleString()}</span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "Date",
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("Date")).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return <span>{date}</span>;
    },
    // Remove filterFn for global search compatibility
  },
  {
    id: "Gross",
    accessorKey: "gross",
    header: "Gross",
    cell: ({ row }) => {
      return <span>{(row.getValue("Gross") as number).toLocaleString()}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "Net",
    accessorKey: "net",
    header: "Net",
    cell: ({ row }) => {
      return (
        <span>
          {(row.getValue("Net") as number).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "bsw",
    header: "BSW",
    cell: (info) => `${info.getValue()}%`,
    footer: (props) => props.column.id,
  },
  {
    id: "Strings Up",
    accessorKey: "stringsUp",
    header: "Strings Up",
    cell: ({ row }) => {
      return (
        <span>{(row.getValue("Strings Up") as number).toLocaleString()}</span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "Strings Available",
    accessorKey: "stringsTotal",
    header: "Strings Available",
    cell: ({ row }) => {
      return (
        <span>
          {(row.getValue("Strings Available") as number)?.toLocaleString()}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
