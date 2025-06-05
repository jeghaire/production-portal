"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Type for a single data point
type ChartDataItem = {
  tankID: string;
  water: number;
  oil: number;
};

interface TankLevelChartProps {
  chartConfig: ChartConfig;
  chartData: ChartDataItem[];
  title: string;
  description: string;
}

export function TankLevelChart({
  chartConfig,
  chartData,
  title,
  description,
}: TankLevelChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tankID"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="water"
              stackId="a"
              fill="var(--color-water)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="oil"
              stackId="a"
              fill="var(--color-oil)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
