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
  entry: Entry | null; // the actual from that day
  target: number; // benchmark target
  selectedDate?: string;
};

export function LocationDifferenceCard({
  location,
  target,
  entry,
  selectedDate,
}: Props) {
  const actualRaw = entry?.value ?? 0;
  const targetRaw = target;

  const differenceRaw = actualRaw - targetRaw;

  const isPositive = differenceRaw >= 0;
  const colorClass = isPositive ? "text-green-600" : "text-red-600";
  const IconComponent = isPositive
    ? IconTriangleFilled
    : IconTriangleInvertedFilled;

  // Format helper
  const formatValue = (val: number) => {
    if (val < 1000) {
      return {
        display: val.toFixed(0),
        suffix: "",
      };
    } else {
      return {
        display: (val / 1000).toFixed(2),
        suffix: "K",
      };
    }
  };

  const actual = formatValue(actualRaw);
  const targetFormatted = formatValue(targetRaw);
  const diffFormatted = formatValue(Math.abs(differenceRaw));

  return (
    <CardContent className="flex flex-col items-center justify-start px-4">
      <div className="flex flex-col items-center justify-center mb-5">
        <CardDescription className="text-sm">
          {entry?.date || selectedDate && selectedDate.replace(/-/g, '/')}
        </CardDescription>
        <CardTitle className="text-lg mb-0">{location}</CardTitle>
      </div>

      <div className="flex items-start w-full justify-between">
        <div className="flex items-center leading-none flex-col">
          <span className="font-bold font-mono text-3xl">
            {targetFormatted.display}
            <span className="text-[27px] font-semibold">
              {targetFormatted.suffix}
            </span>
          </span>
          <span className="text-[10px]">Target</span>
        </div>

        <div
          className={`flex items-center leading-none mt-2 flex-col ${colorClass}`}
        >
          <IconComponent className="w-8 h-8 mb-1" />
          <span className="font-bold font-mono text-2xl">
            {diffFormatted.display}
            <span className="text-[23px] font-semibold">
              {diffFormatted.suffix}
            </span>
          </span>
          <span className="text-[10px]">difference</span>
        </div>

        <div className="flex items-center leading-none flex-col">
          <span className="font-bold font-mono text-3xl">
            {entry?.date ? actual.display : "n/a"}
            <span className="text-[27px] font-semibold">{actual.suffix}</span>
          </span>
          <span className="text-[10px]">Actual</span>
        </div>
      </div>
    </CardContent>
  );
}
