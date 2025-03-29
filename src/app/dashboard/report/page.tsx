"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import chartData from "@/lib/data.json";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useSearchParams, useRouter } from "next/navigation";

const loc = [
  { label: "AFIESERE", value: "AFIESERE" },
  { label: "ERIEMU", value: "ERIEMU" },
  { label: "EVWRENI", value: "EVWRENI" },
  { label: "KOKORI", value: "KOKORI" },
  { label: "OLOMORO", value: "OLOMORO" },
  { label: "ORONI", value: "ORONI" },
  { label: "OWEH", value: "OWEH" },
  { label: "UZERE", value: "UZERE" },
  { label: "UZERE EAST", value: "UZERE EAST" },
];

const chartDataX = {
  AFIESERE: [
    { date: "2024-04-01", bsw: 222, net: 150, gross: 100, stringsUp: 80 },
    { date: "2024-04-02", bsw: 97, net: 180, gross: 120, stringsUp: 90 },
    { date: "2024-04-03", bsw: 167, net: 120, gross: 90, stringsUp: 60 },
    {
      date: "2024-04-04",
      bsw: 242,
      net: 260,
      gross: 150,
      stringsUp: 110,
    },
    {
      date: "2024-04-05",
      bsw: 373,
      net: 290,
      gross: 180,
      stringsUp: 140,
    },
  ],
  ERIEMU: [
    { date: "2024-04-01", bsw: 222, net: 150, gross: 100, stringsUp: 80 },

    { date: "2024-04-02", bsw: 97, net: 180, gross: 120, stringsUp: 90 },
    { date: "2024-04-03", bsw: 167, net: 120, gross: 90, stringsUp: 60 },
    {
      date: "2024-04-04",
      bsw: 242,
      net: 260,
      gross: 150,
      stringsUp: 110,
    },
    {
      date: "2024-04-05",
      bsw: 373,
      net: 290,
      gross: 180,
      stringsUp: 140,
    },
  ],
};
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
  // const searchParams = useSearchParams();

  // // const locn = searchParams.getAll("loc");
  // // console.log(locn);

  // const [selectedLocation, setSelectedLocation] = React.useState("EVWRENI");
  const [open, setOpen] = React.useState(false);
  // // const [value, setValue] = React.useState("");

  // const [selectedValues, setSelectedValues] = React.useState([]);

  // const toggleSelection = (currentValue) => {
  //   setSelectedValues((prev) =>
  //     prev.includes(currentValue)
  //       ? prev.filter((value) => value !== currentValue)
  //       : [...prev, currentValue]
  //   );
  // };

  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract selected locations from query params
  const selectedQueryParams = searchParams.getAll("loc");

  // Set initial state from query params
  const [selectedValues, setSelectedValues] = React.useState(
    selectedQueryParams.length > 0 ? selectedQueryParams : []
  );

  // Function to update selected locations
  const toggleSelection = (currentValue: string) => {
    setSelectedValues((prev) => {
      const newSelectedValues = prev.includes(currentValue)
        ? prev.filter((value) => value !== currentValue)
        : [...prev, currentValue];

      // Update the URL query parameters
      const params = new URLSearchParams(searchParams);
      params.delete("loc");
      newSelectedValues.forEach((value) => params.append("loc", value));

      router.replace(`?${params.toString()}`);

      return newSelectedValues;
    });
  };

  // const [myState, setMyState] = useState("");

  React.useEffect(() => {
    setSelectedValues(
      selectedQueryParams.length > 0 ? selectedQueryParams : []
    );
  }, [searchParams]);

  // Function to aggregate data based on selected locations
  const getAggregatedData = () => {
    const locations =
      selectedValues.length > 0 ? selectedValues : Object.keys(chartData);

    const aggregatedData: Record<string, any>[] = [];

    locations.forEach((location) => {
      chartData[location].forEach((entry: any, index: number) => {
        if (!aggregatedData[index]) {
          aggregatedData[index] = {
            date: entry.date,
            bsw: 0,
            net: 0,
            gross: 0,
            stringsUp: 0,
          };
        }
        aggregatedData[index].bsw += entry.bsw;
        aggregatedData[index].net += entry.net;
        aggregatedData[index].gross += entry.gross;
        aggregatedData[index].stringsUp += entry.stringsUp;
      });
    });

    return aggregatedData;
  };

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
            Prices are subject to the rate of the US dollar!
          </p>
        </CardFooter>
      </Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card className="col-span-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Area Chart - Interactive</CardTitle>
            <CardDescription>
              Showing total visitors for the last 3 months
            </CardDescription>
          </div>
          {/* <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {Object.keys(chartData).map((location) => (
                <SelectItem
                  key={location}
                  value={location}
                  className="rounded-lg"
                >
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {/* {value
                  ? loc.find((framework) => framework.value === value)
                      ?.label
                  : "Select location..."} */}
                {selectedValues.length > 0
                  // ? selectedValues
                  //     .map(
                  //       (value) =>
                  //         loc.find((framework) => framework.value === value)
                  //           ?.label
                  //     )
                  //     .join(", ")
                  ? (() => {
                    const selectedLabels = selectedValues
                      .map((value) => loc.find((framework) => framework.value === value)?.label)
                      .filter(Boolean); // Removes any undefined values
              
                    return selectedLabels.length > 2
                      ? `${selectedLabels.slice(0, 2).join(", ")}...`
                      : selectedLabels.join(", ");
                  })()
                  : "ALL LOCATIONS"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search locations..." />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    {loc.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        // onSelect={(currentValue) => {
                        //   setValue(currentValue === value ? "" : currentValue);
                        //   setOpen(false);
                        // }}
                        onSelect={() => toggleSelection(framework.value)}
                      >
                        <Check
                          // className={cn(
                          //   "mr-2 h-4 w-4",
                          //   value === framework.value
                          //     ? "opacity-100"
                          //     : "opacity-0"
                          // )}
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedValues.includes(framework.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[450px] w-full"
          >
            {/* <AreaChart data={chartData[selectedLocation]}> */}
            <AreaChart data={getAggregatedData()}>
              <defs>
                <linearGradient id="fillNet" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-net)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-net)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillBsw" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-bsw)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-bsw)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillGross" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-gross)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-gross)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillStringsUp" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-stringsUp)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-stringsUp)"
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
                    year: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={5}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="net"
                type="natural"
                fill="url(#fillNet)"
                stroke="var(--color-net)"
                stackId="a"
              />
              <Area
                dataKey="gross"
                type="natural"
                fill="url(#fillGross)"
                stroke="var(--color-gross)"
                stackId="a"
              />
              <Area
                dataKey="bsw"
                type="natural"
                fill="url(#fillBsw)"
                stroke="var(--color-bsw)"
                stackId="a"
              />
              <Area
                dataKey="stringsUp"
                type="natural"
                fill="url(#fillStringsUp)"
                stroke="var(--color-stringsUp)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
