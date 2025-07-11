import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const gasFlaringData = [
  { id:1, location: "AFIESERE", amount: 4.44 },
  { location: "ERIEMU", amount: 8.78 },
  { location: "EVWRENI", amount: 0.15 },
  { location: "KOKORI", amount: 2.17 },
  { location: "OLOMORO", amount: 21.44 },
  { location: "ORONI", amount: 1.76 },
  { location: "OWEH", amount: 8.04 },
  { location: "UZERE WEST", amount: 2.96 }
]


export function GasFlaringTable() {
  return (
    <>
    <h1 className="text-lg font-medium ">Gas Flared (MMSCFD)</h1>
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Location</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gasFlaringData.map((entry) => (
          <TableRow key={entry.location}>
            <TableCell className="font-medium w-">{entry.location}</TableCell>
            <TableCell className="text-right">{entry.amount}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell className="text-base font-medium">Total</TableCell>
          <TableCell className="text-right font-medium">
            {gasFlaringData.reduce((sum, { amount }) => sum + amount, 0)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    </>
  )
}
