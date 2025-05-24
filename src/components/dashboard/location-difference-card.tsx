import { CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  IconTriangleFilled,
  IconTriangleInvertedFilled,
} from "@tabler/icons-react";
type Entry = {
  date: string;
  value: number;
};

type Props = {
  location: string;
  entries: Entry[]; // <-- Allow any number of entries (e.g. 0, 1, 2+)
};

export function LocationDifferenceCard({ location, entries }: Props) {
  const [currentEntry, previousEntry] = entries;

  const currentValue = currentEntry
    ? (currentEntry.value / 1000).toFixed(2)
    : "0.00";
  const previousValue = previousEntry
    ? (previousEntry.value / 1000).toFixed(2)
    : "0.00";

  const difference = (
    parseFloat(currentValue) - parseFloat(previousValue)
  ).toFixed(2);

  const isPositive = parseFloat(difference) >= 0;
  const colorClass = isPositive ? "text-green-600" : "text-red-600";
  const IconComponent = isPositive
    ? IconTriangleFilled
    : IconTriangleInvertedFilled;

  return (
    <CardContent className="flex flex-col items-center justify-start px-4">
      <div className="flex flex-col items-center justify-center mb-5">
        <CardDescription className="text-sm">
          {currentEntry?.date || "N/A"}
        </CardDescription>
        <CardTitle className="text-lg mb-0">{location}</CardTitle>
      </div>

      <div className="flex items-start w-full justify-between">
        <div className="flex items-center leading-none flex-col">
          <span className="font-bold font-mono text-3xl">
            {previousValue}
            <span className="text-[27px] font-semibold">K</span>
          </span>
          <span className="text-[10px]">Previous Day</span>
        </div>

        <div
          className={`flex items-center leading-none mt-2 flex-col ${colorClass}`}
        >
          <IconComponent className="w-8 h-8 mb-1" />
          <span className="font-bold font-mono text-2xl">
            {difference}
            <span className="text-[23px] font-semibold">K</span>
          </span>
          <span className="text-[10px]">versus</span>
        </div>

        <div className="flex items-center leading-none flex-col">
          <span className="font-bold font-mono text-3xl">
            {currentValue}
            <span className="text-[27px] font-semibold">K</span>
          </span>
          <span className="text-[10px]">Selected Day</span>
        </div>
      </div>
    </CardContent>
  );
}
