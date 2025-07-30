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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="uppercase">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {chartData.length !== 0 ? (
        <CardContent>
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="tankID"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="min-w-[150px]" hideLabel />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {!isMobile && (
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  type="number"
                  label={{
                    value: title,
                    angle: -90,
                    position: "center",
                    dx: -25,
                  }}
                />
              )}
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
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      ) : (
        <div className="text-sm grid place-items-center h-full hover:bg-muted/50 transition-colors min-h-[320]">
          <span className="m-3 text-muted-foreground">
            No data available for the selected time period and locations.
          </span>
        </div>
      )}
    </Card>
  );
}
