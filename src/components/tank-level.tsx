"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
        <CardTitle className="uppercase">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              type="number"
              label={{
                value: title,
                angle: -90,
                position: "left",
                dx: 10,
                // offset: 10,
              }}
            />
            <Bar
              dataKey="water"
              stackId="a"
              fill="var(--color-water)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="oil"
              stackId="a"
              fill="var(--color-oil)"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
