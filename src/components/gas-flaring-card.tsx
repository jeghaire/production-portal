import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardTitle } from "./ui/card";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchGasFlared } from "@/lib/fetch-gas-flared";

export default function GasFlaringCard() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  // Get day param or default to previous day
  let day = searchParams.get("day");
  if (!day) {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    day = `${dd}-${mm}-${yyyy}`;
  }

  function toApiDate(str: string | null) {
    if (!str) return "";
    const [dd, mm, yyyy] = str.split("-");
    return `${parseInt(mm)}/${parseInt(dd)}/${yyyy}`;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiDate = toApiDate(day);
        const result = await fetchGasFlared(apiDate);
        setData(result);
      } catch {
        setData([]);
      }
    };
    fetchData();
  }, [day]);

  return (
    <Card className="p-3 sm:p-4 gap-4 h-full">
      <CardTitle>Gas Flared (MMSCFD)</CardTitle>
      {data.length === 0 ? (
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
            {data.map((entry) => (
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
                  data
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
