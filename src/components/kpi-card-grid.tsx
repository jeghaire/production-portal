"use client";

import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

type Kpi = {
  title: string;
  progress: number;
  target: number;
  currentValue: number;
  previousValue: number;
};

const kpiData: Kpi[] = [
  {
    title: "Capex",
    progress: 15.9,
    target: 80000,
    currentValue: 12699,
    previousValue: 11200,
  },
  {
    title: "Opex",
    progress: 36.5,
    target: 125000,
    currentValue: 45564,
    previousValue: 36700,
  },
  {
    title: "Monthly Income",
    progress: 53.6,
    target: 200000,
    currentValue: 71465,
    previousValue: 79500,
  },
];

type DeltaType =
  | "increase"
  | "decrease"
  | "moderateIncrease"
  | "moderateDecrease"
  | "unchanged";

const getDeltaType = (delta: number): DeltaType => {
  if (delta > 0) return delta > 10 ? "increase" : "moderateIncrease";
  if (delta < 0) return delta < -10 ? "decrease" : "moderateDecrease";
  return "unchanged";
};

const dataFormatter = (number: number) =>
  `$${Intl.NumberFormat("us").format(number).toString()}`;

export default function KpiCardGrid() {
  return (
    <div className="sm:grid-col-2 mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3">
      {kpiData.map((item) => {
        const deltaValue =
          ((item.currentValue - item.previousValue) / item.previousValue) * 100;
        const delta = `${deltaValue.toFixed(1)}%`;
        const deltaType = getDeltaType(deltaValue);

        return (
          <Card key={item.title} className="p-3 md:p-6">
            <div className="flex items-center justify-between">
              <h4 className="truncate text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                {item.title}
              </h4>
              <Badge variant="outline">{delta}</Badge>
            </div>

            <p className="font-clash text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {dataFormatter(item.currentValue)}
            </p>
            <p className="mt-4 flex items-center justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              <span className="truncate">
                {`${item.progress}% of annual target`}
              </span>
              <span className="text-nowrap">{dataFormatter(item.target)}</span>
            </p>
            <progress value={item.progress} className="h-2" />
          </Card>
        );
      })}
    </div>
  );
}
