"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import chartData from "@/lib/data.json";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  bsw: {
    label: "BSW",
    color: "hsl(var(--chart-1))",
  },
  net: {
    label: "Net",
    color: "hsl(var(--chart-2))",
  },
  gross: {
    label: "Gross",
    color: "hsl(var(--chart-3))",
  },
  stringsUp: {
    label: "Strings Up",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function Component() {
  return (
    <section className="mx-auto p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Line Chart - Multiple</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-screen max-w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData["AFIESERE"]}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="net"
                type="monotone"
                stroke="var(--color-net)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="gross"
                type="monotone"
                stroke="var(--color-gross)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="bsw"
                type="monotone"
                stroke="var(--color-bsw)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="stringsUp"
                type="monotone"
                stroke="var(--color-stringsUp)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
