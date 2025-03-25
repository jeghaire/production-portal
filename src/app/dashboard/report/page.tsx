"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  Label,
  Pie,
  PieChart,
  Bar,
  BarChart,
  LabelList,
  ReferenceLine,
  YAxis,
  Cell,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "./filters";

const chartDataLine = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfigLine = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const chartDataUPTIME = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfigUPTIME = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const chartDataNetChange = [
  { period: "Mon", change: 0.42 },
  { period: "Tue", change: -0.31 },
  { period: "Wed", change: 0.65 },
  { period: "Thu", change: -0.24 },
  { period: "Fri", change: -0.53 },
  { period: "Mon", change: 0.38 },
  { period: "Tue", change: 0.71 },
  { period: "Wed", change: -0.45 },
  { period: "Thu", change: 0.29 },
  { period: "Fri", change: -0.18 },
];

// Define chart configuration
const chartConfigNetChange = {
  change: {
    label: "Net Change",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const chartDataBar = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfigBar = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const chartDataX = [
  { month: "Jan", visitors: 192 },
  { month: "Feb", visitors: 218 },
  { month: "Mar", visitors: -174 },
  { month: "Apr", visitors: 203 },
  { month: "May", visitors: -211 },
  { month: "Jun", visitors: 187 },
  { month: "Jul", visitors: 178 },
  { month: "Aug", visitors: 222 },
  { month: "Sep", visitors: -198 },
  { month: "Oct", visitors: 169 },
  { month: "Nov", visitors: -215 },
  { month: "Dec", visitors: 206 },
];

const chartConfigX = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig;

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
  { date: "2025-04-01", desktop: 245, mobile: 160 },
  { date: "2025-04-02", desktop: 110, mobile: 190 },
  { date: "2025-04-03", desktop: 178, mobile: 135 },
  { date: "2025-04-04", desktop: 258, mobile: 275 },
  { date: "2025-04-05", desktop: 390, mobile: 305 },
  { date: "2025-04-06", desktop: 320, mobile: 355 },
  { date: "2025-04-07", desktop: 260, mobile: 190 },
  { date: "2025-04-08", desktop: 430, mobile: 330 },
  { date: "2025-04-09", desktop: 70, mobile: 125 },
  { date: "2025-04-10", desktop: 275, mobile: 205 },
  { date: "2025-04-11", desktop: 345, mobile: 365 },
  { date: "2025-04-12", desktop: 305, mobile: 225 },
  { date: "2025-04-13", desktop: 355, mobile: 390 },
  { date: "2025-04-14", desktop: 150, mobile: 230 },
  { date: "2025-04-15", desktop: 130, mobile: 180 },
  { date: "2025-04-16", desktop: 145, mobile: 200 },
  { date: "2025-04-17", desktop: 460, mobile: 375 },
  { date: "2025-04-18", desktop: 380, mobile: 425 },
  { date: "2025-04-19", desktop: 255, mobile: 195 },
  { date: "2025-04-20", desktop: 95, mobile: 160 },
  { date: "2025-04-21", desktop: 145, mobile: 210 },
  { date: "2025-04-22", desktop: 238, mobile: 185 },
  { date: "2025-04-23", desktop: 150, mobile: 240 },
  { date: "2025-04-24", desktop: 400, mobile: 305 },
  { date: "2025-04-25", desktop: 225, mobile: 265 },
  { date: "2025-04-26", desktop: 85, mobile: 140 },
  { date: "2025-04-27", desktop: 395, mobile: 435 },
  { date: "2025-04-28", desktop: 135, mobile: 190 },
  { date: "2025-04-29", desktop: 325, mobile: 255 },
  { date: "2025-04-30", desktop: 470, mobile: 390 },
  { date: "2025-05-01", desktop: 175, mobile: 230 },
  { date: "2025-05-02", desktop: 310, mobile: 320 },
  { date: "2025-05-03", desktop: 260, mobile: 205 },
  { date: "2025-05-04", desktop: 400, mobile: 435 },
  { date: "2025-05-05", desktop: 495, mobile: 405 },
  { date: "2025-05-06", desktop: 510, mobile: 540 },
  { date: "2025-05-07", desktop: 400, mobile: 310 },
  { date: "2025-05-08", desktop: 160, mobile: 220 },
  { date: "2025-05-09", desktop: 240, mobile: 195 },
  { date: "2025-05-10", desktop: 310, mobile: 345 },
  { date: "2025-05-11", desktop: 350, mobile: 280 },
  { date: "2025-05-12", desktop: 210, mobile: 255 },
  { date: "2025-05-13", desktop: 205, mobile: 170 },
  { date: "2025-05-14", desktop: 460, mobile: 505 },
  { date: "2025-05-15", desktop: 490, mobile: 390 },
  { date: "2025-05-16", desktop: 350, mobile: 415 },
  { date: "2025-05-17", desktop: 510, mobile: 435 },
  { date: "2025-05-18", desktop: 330, mobile: 365 },
  { date: "2025-05-19", desktop: 245, mobile: 195 },
  { date: "2025-05-20", desktop: 185, mobile: 245 },
  { date: "2025-05-21", desktop: 95, mobile: 155 },
  { date: "2025-05-22", desktop: 90, mobile: 135 },
  { date: "2025-05-23", desktop: 265, mobile: 305 },
  { date: "2025-05-24", desktop: 310, mobile: 235 },
  { date: "2025-05-25", desktop: 215, mobile: 265 },
  { date: "2025-05-26", desktop: 225, mobile: 185 },
  { date: "2025-05-27", desktop: 435, mobile: 480 },
  { date: "2025-05-28", desktop: 245, mobile: 205 },
  { date: "2025-05-29", desktop: 90, mobile: 140 },
  { date: "2025-05-30", desktop: 355, mobile: 295 },
  { date: "2025-05-31", desktop: 190, mobile: 245 },
  { date: "2025-06-01", desktop: 190, mobile: 215 },
  { date: "2025-06-02", desktop: 485, mobile: 425 },
  { date: "2025-06-03", desktop: 115, mobile: 175 },
  { date: "2025-06-04", desktop: 455, mobile: 395 },
  { date: "2025-06-05", desktop: 100, mobile: 155 },
  { date: "2025-06-06", desktop: 310, mobile: 265 },
  { date: "2025-06-07", desktop: 340, mobile: 385 },
  { date: "2025-06-08", desktop: 400, mobile: 335 },
  { date: "2025-06-09", desktop: 455, mobile: 495 },
  { date: "2025-06-10", desktop: 170, mobile: 215 },
  { date: "2025-06-11", desktop: 105, mobile: 165 },
  { date: "2025-06-12", desktop: 505, mobile: 435 },
  { date: "2025-06-13", desktop: 95, mobile: 145 },
  { date: "2025-06-14", desktop: 440, mobile: 395 },
  { date: "2025-06-15", desktop: 320, mobile: 365 },
  { date: "2025-06-16", desktop: 385, mobile: 325 },
  { date: "2025-06-17", desktop: 490, mobile: 535 },
  { date: "2025-06-18", desktop: 120, mobile: 185 },
  { date: "2025-06-19", desktop: 355, mobile: 305 },
  { date: "2025-06-20", desktop: 425, mobile: 470 },
  { date: "2025-06-21", desktop: 185, mobile: 225 },
  { date: "2025-06-22", desktop: 330, mobile: 285 },
  { date: "2025-06-23", desktop: 495, mobile: 550 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const chartDataRadial = [{ month: "january", desktop: 1260, mobile: 570 }];

const chartConfigRadial = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Component() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const totalVisitors = React.useMemo(() => {
    return chartDataUPTIME.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  // Custom bar props function to determine color based on value
  const getBarProps = (entry: any) => {
    return {
      fill:
        entry.change >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))",
    };
  };

  const totalVisitors1 = chartDataRadial[0].desktop + chartDataRadial[0].mobile;

  return (
    <section className="mx-auto p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Production Status</CardTitle>
          <CardDescription>BPOD/Barrels per day</CardDescription>
        </CardHeader>
        <CardContent>{/* <p>Card Content</p> */}</CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Amet gerid el Inventore, voluptatibus!
          </p>
        </CardFooter>
      </Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card className="col-span-3">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Area Chart - Interactive</CardTitle>
            <CardDescription>
              Showing total visitors for the last 3 months
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="2025" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                2025
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                2024
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                2023
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line Chart - Multiple</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigLine}>
            <LineChart
              accessibilityLayer
              data={chartDataLine}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="mobile"
                type="monotone"
                stroke="var(--color-mobile)"
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
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Donut with Text</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfigUPTIME}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartDataUPTIME}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={70}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Bar Chart - Label</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigBar}>
            <BarChart
              accessibilityLayer
              data={chartDataBar}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground text-foreground font-mono font-medium tabular-nums"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Bar Chart - Negative</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigX}>
            <BarChart accessibilityLayer data={chartDataX}>
              <CartesianGrid vertical={false} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      `${Number(value).toFixed(2)}`,
                      " Net Change",
                    ]}
                  />
                }
              />
              <Bar dataKey="visitors" radius={6} barSize={50}>
                <LabelList
                  position="top"
                  dataKey="month"
                  fillOpacity={1}
                  className="font-medium"
                />
                {chartDataX.map((item) => (
                  <Cell
                    key={item.month}
                    fill={
                      item.visitors > 0
                        ? "hsl(var(--chart-1))"
                        : "hsl(var(--chart-2))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Radial Chart - Stacked</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center pb-0">
          <ChartContainer
            config={chartConfigRadial}
            className="mx-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={chartDataRadial}
              endAngle={180}
              innerRadius={80}
              outerRadius={130}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalVisitors1.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="desktop"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-desktop)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="mobile"
                fill="var(--color-mobile)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Forex Net Changes</CardTitle>
          <CardDescription>
            Daily net changes over the last two weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigNetChange}>
            <BarChart
              data={chartDataNetChange}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              accessibilityLayer
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${value.toFixed(2)}`}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      `${Number(value).toFixed(2)}`,
                      "Net Change",
                    ]}
                  />
                }
              />
              <Bar
                dataKey="change"
                radius={4}
                barSize={30}
                isAnimationActive={true}
                animationDuration={500}
                fill="var(--color-change)"
                //   getBarProps={getBarProps}
                // />
              >
                {chartDataNetChange.map((entry, index) => (
                  <Bar key={index} dataKey="change" /> //fill={entry.fill}
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-primary"></span>
            <span className="font-medium">Gains</span>
            <span className="inline-block h-3 w-3 rounded-full bg-destructive ml-4"></span>
            <span className="font-medium">Losses</span>
          </div>
          <div className="leading-none text-muted-foreground">
            Chart shows daily net changes in currency value
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
