"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

type ProductionData = {
  date: string;
  stringsUp: number;
  gross: number;
  net: number;
  bsw: number;
  location: string;
};

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
      return <span>{row.getValue("Location").toLocaleString()}</span>;
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
      const date = new Date(row.getValue("Date")).toLocaleDateString();
      return <span>{date}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "Gross",
    accessorKey: "gross",
    header: "Gross",
    cell: ({ row }) => {
      return <span>{row.getValue("Gross").toLocaleString()}</span>;
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
          {row.getValue("Net").toLocaleString(undefined, {
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
      return <span>{row.getValue("Strings Up").toLocaleString()}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
