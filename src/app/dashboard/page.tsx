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
import {
  IconArrowUp,
  IconDroplet,
  IconDropletFilled,
  IconFlame,
  IconCheck,
  IconSelector,
  IconAlertCircleFilled,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

const options = [
  { label: "GROSS", value: "GROSS" },
  { label: "NET", value: "NET" },
  { label: "BSW", value: "BSW" },
  { label: "STRINGSUP", value: "STRINGSUP" },
];

// const chartDataX = {
//   AFIESERE: [
//     { date: "2024-04-01", bsw: 222, net: 150, gross: 100, stringsUp: 80 },
//     { date: "2024-04-02", bsw: 97, net: 180, gross: 120, stringsUp: 90 },
//     { date: "2024-04-03", bsw: 167, net: 120, gross: 90, stringsUp: 60 },
//     {
//       date: "2024-04-04",
//       bsw: 242,
//       net: 260,
//       gross: 150,
//       stringsUp: 110,
//     },
//     {
//       date: "2024-04-05",
//       bsw: 373,
//       net: 290,
//       gross: 180,
//       stringsUp: 140,
//     },
//   ],
//   ERIEMU: [
//     { date: "2024-04-01", bsw: 222, net: 150, gross: 100, stringsUp: 80 },

//     { date: "2024-04-02", bsw: 97, net: 180, gross: 120, stringsUp: 90 },
//     { date: "2024-04-03", bsw: 167, net: 120, gross: 90, stringsUp: 60 },
//     {
//       date: "2024-04-04",
//       bsw: 242,
//       net: 260,
//       gross: 150,
//       stringsUp: 110,
//     },
//     {
//       date: "2024-04-05",
//       bsw: 373,
//       net: 290,
//       gross: 180,
//       stringsUp: 140,
//     },
//   ],
// };

const chartConfig = {
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
  // const [selectedLocation, setSelectedLocation] = React.useState("EVWRENI");
  const [open, setOpen] = React.useState(false);
  const [openT, setOpenT] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract selected locations from query params
  const selectedQueryParams = searchParams.getAll("loc");

  // Set initial state from query params
  const [selectedValues, setSelectedValues] = React.useState(
    selectedQueryParams.length > 0 ? selectedQueryParams : []
  );
  const [filterT, setFilterT] = React.useState([
    "BSW",
    "NET",
    "GROSS",
    "STRINGSUP",
  ]);

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

  const toggleFilterT = (newItem: string) => {
    setFilterT(
      (prevItems) =>
        prevItems.includes(newItem)
          ? prevItems.filter((item) => item !== newItem) // Remove if exists
          : [...prevItems, newItem] // Add if not exists
    );
  };

  React.useEffect(() => {
    setSelectedValues(
      selectedQueryParams.length > 0 ? selectedQueryParams : ["EVWRENI"]
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
    <section className="p-5 grid grid-cols-1 @xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Production Status</CardTitle>
            <Badge variant="default" className="text-xs font-mono">
              <IconArrowUp className="!h-4 !w-4 mr-1" />
              <span className="tracking-wider">46%</span>
            </Badge>
          </div>

          <CardDescription>BPOD/Barrels per day</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-black text-4xl">$94,330.00</p>
          <p className="mt-5 flex items-center justify-between text-muted-foreground text-xs">
            <span className="truncate">{`26% of annual target`}</span>
            <span className="text-nowrap">
              ${(94330 * (100 / 60)).toFixed(2)}
            </span>
          </p>
          <Progress value={26} className="mt-1 h-1.5" />
        </CardContent>
        <CardFooter className="flex flex-col flex-start items-start">
          <div className="flex items-center gap-2">
            <IconAlertCircleFilled className="w-3.5" />
            <p className="text-xs text-muted-foreground">
              Prices are subject to the rate of the US dollar!
            </p>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gross</CardTitle>
            <Badge variant="default" className="text-xs font-mono">
              <IconArrowUp className="!h-4 !w-4 mr-1" />
              <span>53%</span>
            </Badge>
          </div>

          <CardDescription>Gross sum of production for 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-black text-4xl">$82,503,492.00</p>
          <p className="mt-5 flex items-center justify-between text-muted-foreground text-xs">
            <span className="truncate">{`60% of annual target`}</span>
            <span className="text-nowrap">
              ${(82503492.0 * (100 / 60)).toFixed(2)}
            </span>
          </p>
          <Progress value={60} className="mt-1 h-1.5" />
        </CardContent>
        <CardFooter className="flex flex-col flex-start items-start">
          <div className="flex items-center gap-2">
            <IconAlertCircleFilled className="w-3.5" />
            <p className="text-xs text-muted-foreground">
              Prices are subject to the rate of the US dollar!
            </p>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Net Production</CardTitle>
            <Badge variant="default" className="text-xs font-mono">
              <IconArrowUp className="!h-4 !w-4 mr-1" />
              <span className="tracking-wider">12%</span>
            </Badge>
          </div>

          <CardDescription>Net sum of production for 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-black text-4xl">$218,740.26</p>

          <p className="mt-5 flex items-center justify-between text-muted-foreground text-xs">
            <span className="truncate">{`27.5% of annual target`}</span>
            <span className="text-nowrap">
              ${(218740.26 * (100 / 27.5)).toFixed(2)}
            </span>
          </p>
          <Progress value={27.5} className="mt-1 h-1.5" />
        </CardContent>
        <CardFooter className="flex flex-col flex-start items-start">
          <div className="flex items-center gap-2">
            <IconAlertCircleFilled className="w-3.5" />
            <p className="text-xs text-muted-foreground">
              Prices are subject to the rate of the US dollar!
            </p>
          </div>
        </CardFooter>
      </Card>
      <Card className="col-span-full">
        <CardHeader className="flex flex-col items-center gap-2 space-y-0 border-b py-5 md:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Gas/Oil Production</CardTitle>
            <CardDescription>
              Showing total Oil Production for the last 1 year
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

          <Popover open={openT} onOpenChange={setOpenT}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {selectedValues.length > 0
                  ? (() => {
                      const selectedLabels = filterT
                        .map(
                          (value) =>
                            options.find(
                              (framework) => framework.value === value
                            )?.label
                        )
                        .filter(Boolean); // Removes any undefined values

                      return selectedLabels.length > 2
                        ? `${selectedLabels.slice(0, 2).join(", ")}...`
                        : selectedLabels.join(", ");
                    })()
                  : "Filter Chart"}
                <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search chart filters..." />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => toggleFilterT(option.value)}
                      >
                        <IconCheck
                          className={cn(
                            "mr-2 h-4 w-4",
                            filterT.includes(option.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

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
                  ? // ? selectedValues
                    //     .map(
                    //       (value) =>
                    //         loc.find((framework) => framework.value === value)
                    //           ?.label
                    //     )
                    //     .join(", ")
                    (() => {
                      const selectedLabels = selectedValues
                        .map(
                          (value) =>
                            loc.find((framework) => framework.value === value)
                              ?.label
                        )
                        .filter(Boolean); // Removes any undefined values

                      return selectedLabels.length > 2
                        ? `${selectedLabels.slice(0, 2).join(", ")}...`
                        : selectedLabels.join(", ");
                    })()
                  : "ALL LOCATIONS"}
                <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                        <IconCheck
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
            className="aspect-auto h-[350px] w-full"
          >
            {/* <AreaChart data={chartData[selectedLocation]}> */}
            <AreaChart data={getAggregatedData()}>
              <defs>
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
                tickMargin={5}
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

              {filterT.includes("STRINGSUP") && (
                <Area
                  dataKey="stringsUp"
                  type="natural"
                  fill="url(#fillStringsUp)"
                  stroke="var(--color-stringsUp)"
                  stackId="a"
                />
              )}

              {filterT.includes("BSW") && (
                <Area
                  dataKey="bsw"
                  type="natural"
                  fill="url(#fillBsw)"
                  stroke="var(--color-bsw)"
                  stackId="a"
                />
              )}

              {filterT.includes("NET") && (
                <Area
                  dataKey="net"
                  type="natural"
                  fill="url(#fillNet)"
                  stroke="var(--color-net)"
                  stackId="a"
                />
              )}

              {filterT.includes("GROSS") && (
                <Area
                  dataKey="gross"
                  type="natural"
                  fill="url(#fillGross)"
                  stroke="var(--color-gross)"
                  stackId="a"
                />
              )}

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
