"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "A bar chart with an active bar";

const chartData = [
  { location: "tpi", count: 2, fill: "var(--color-neutral-500)" },
  { location: "mech", count: 8, fill: "var(--color-cyan-700)" },
  { location: "total", count: 10, fill: "var(--color-red-800)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  tpi: {
    label: "TPI",
    color: "var(--color-neutral-500)",
  },
  mech: {
    label: "MECHANICAL",
    color: "var(--color-cyan-700)",
  },
  total: {
    label: "TOTAL",
    color: "var(--color-red-800)",
  },
} satisfies ChartConfig;

export function TFPIncidentChart() {
  const isMobile = useIsMobile()
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>TFP INCIDENTS - YTD</CardTitle>
        <CardDescription>Showing TFP incidents count - YTD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-full min-h-[260] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="location"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                {!isMobile && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              type="number"
              label={{
                value: "TFP Incidents count",
                angle: -90,
                position: "center",
                dx: -10,
              }}
            />)}
            <Bar
              dataKey="count"
              strokeWidth={2}
              radius={[8, 8, 0, 0]}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
