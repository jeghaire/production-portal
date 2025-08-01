import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardTitle } from "./ui/card";
import { GasProductionResponse } from "@/lib/definitions";

export default function GasFlaringCard({
  gasFlared,
}: {
  gasFlared: GasProductionResponse;
}) {
  return (
    <Card className="p-3 sm:p-4 gap-4 h-full">
      <CardTitle>Gas Flared (MMSCFD)</CardTitle>
      {gasFlared.length === 0 ? (
        <div className="text-sm grid place-items-center h-full hover:bg-muted/50 transition-colors min-h-[100]">
          <span className="m-3 text-muted-foreground">
            No data available for the selected time period and locations.
          </span>
        </div>
      ) : (
        <Table className="caption-none">
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gasFlared.map((entry) => (
              <TableRow key={entry.fieldname.trim()}>
                <TableCell className="font-medium">
                  {entry.fieldname.trim()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {entry.flaredgas}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="text-base font-medium">Total</TableCell>
              <TableCell className="text-right font-medium font-mono">
                {Number(
                  gasFlared
                    .reduce(
                      (sum, { flaredgas }) => sum + (Number(flaredgas) || 0),
                      0
                    )
                    .toFixed(3)
                ).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
