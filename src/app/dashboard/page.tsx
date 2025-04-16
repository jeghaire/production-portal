"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, Label, XAxis, YAxis } from "recharts";

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
  IconDropletsFilled,
  IconFlameFilled,
  IconBarrel,
  IconTriangleInvertedFilled,
  IconTriangleFilled,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  { label: "GROSS", value: "gross" },
  { label: "NET", value: "net" },
  { label: "BSW", value: "bsw" },
  { label: "STRINGS UP", value: "stringsUp" },
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
  const selectedMonth = searchParams.getAll("mnt");
  const selectedYear = searchParams.getAll("yr");

  // Set initial state from query params
  const [selectedValues, setSelectedValues] = React.useState(
    selectedQueryParams.length > 0 ? selectedQueryParams : []
  );
  const [filterT, setFilterT] = React.useState([
    "bsw",
    "net",
    "gross",
    "stringsUp",
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

  // React.useEffect(() => {
  //   setSelectedValues(
  //     selectedQueryParams.length > 0 ? selectedQueryParams : []
  //   );
  // }, [searchParams]);

  React.useEffect(() => {
    const incoming = selectedQueryParams.length > 0 ? selectedQueryParams : [];
    setSelectedValues((prev) =>
      JSON.stringify(prev) !== JSON.stringify(incoming) ? incoming : prev
    );
  }, [searchParams]);

  // Function to aggregate data based on selected locations
  const getAggregatedData = () => {
    const locations =
      selectedValues.length > 0 ? selectedValues : Object.keys(chartData);

    const aggregatedData: Record<string, any>[] = [];

    locations.forEach((location) => {
      march2025Data[location].forEach((entry: any, index: number) => {
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

  const result = {};
  const data = { ...chartData };

  for (const key in data) {
    // Sort the array by date in descending order
    const sorted = [...data[key]].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    // Take the first two elements (most recent dates)
    result[key] = sorted.slice(0, 2);
  }

  const carouselData = Object.entries(result).map(([location, items]) => ({
    location, // "AFIESERE" or "ERIEMU"
    entries: items.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-GB"), // "DD/MM/YYYY"
      value: item.net, // or item.gross, item.stringsUp, etc.
      rawData: item, // Keep original data for calculations
    })),
  }));

  function getMonthDataByName(data, monthName, year) {
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

    return Object.keys(data).reduce((acc, location) => {
      acc[location] = data[location].filter((entry) => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getMonth() === monthIndex &&
          entryDate.getFullYear() === year
        );
      });
      return acc;
    }, {});
  }

  // Usage:
  const march2025Data = getMonthDataByName(
    chartData,
    selectedMonth.length ? selectedMonth[0].slice(0, 3) : "MAR",
    selectedYear.length ? Number(selectedYear[0]) : 2025
  );

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
          <p className="font-black text-4xl">
            45,240
            <span className="ml-1 text-base font-medium text-muted-foreground">
              bbl
            </span>
          </p>
          <p className="mt-5 flex items-center justify-between text-muted-foreground text-xs">
            <span className="truncate">{`76% of daily target`}</span>
            <span className="text-nowrap">
              {(45240 * (100 / 76)).toFixed(2)}
            </span>
          </p>
          <Progress value={76} className="mt-1 h-1.5" />
        </CardContent>
        {/* <CardFooter className="flex flex-col flex-start items-start">
          <div className="flex items-center gap-2">
            <IconAlertCircleFilled className="w-3.5" />
            <p className="text-xs text-muted-foreground">
              Prices are subject to the rate of the US dollar!
            </p>
          </div>
        </CardFooter> */}
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

          <CardDescription>Gross production per day</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-black text-4xl">
            170,420
            <span className="ml-1 text-base font-medium text-muted-foreground">
              bbl
            </span>
          </p>
          <p className="mt-5 flex items-center justify-between text-muted-foreground text-xs">
            <span className="truncate">{`60% of daily target`}</span>
            <span className="text-nowrap">
              {(170420 * (100 / 60)).toFixed(2)}
            </span>
          </p>
          <Progress value={60} className="mt-1 h-1.5" />
        </CardContent>
        {/* <CardFooter className="flex flex-col flex-start items-start">
          <div className="flex items-center gap-2">
            <IconAlertCircleFilled className="w-3.5" />
            <p className="text-xs text-muted-foreground">
              Prices are subject to the rate of the US dollar!
            </p>
          </div>
        </CardFooter> */}
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

          <CardDescription>Net production YTD</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-black text-4xl">
            3,143,740.26
            <span className="ml-1 text-base font-medium text-muted-foreground">
              bbl
            </span>
          </p>

          <p className="mt-5 flex items-center justify-between text-muted-foreground text-xs">
            <span className="truncate">{`27.5% of annual target`}</span>
            <span className="text-nowrap">
              {(3143740.26 * (100 / 27.5)).toFixed(2)}
            </span>
          </p>
          <Progress value={27.5} className="mt-1 h-1.5" />
        </CardContent>
        {/* <CardFooter className="flex flex-col flex-start items-start">
          <div className="flex items-center gap-2">
            <IconAlertCircleFilled className="w-3.5" />
            <p className="text-xs text-muted-foreground">
              Prices are subject to the rate of the US dollar!
            </p>
          </div>
        </CardFooter> */}
      </Card>
      <Card>
        <Carousel className="w-full">
          <CarouselContent>
            {/* {Array.from({ length: 5 }).map((_, index) => ( */}
            {/* {carouselData.map(({ location, value, date }, index) => (
              <CarouselItem key={index} className="w-full">
                <div>
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <div className="flex flex-col items-center justify-center">
                      <span className="font-medium text-sm font-mono">
                        {date}
                      </span>
                      <span className="text-2xl my-5">{location}</span>
                    </div>
                    <div className="flex items-start w-full justify-between">
                      <div className="flex items-center leading-none flex-col">
                        <span className="font-bold font-mono">7.13K</span>
                        <span className="text-[10px]">Previous Day</span>
                      </div>
                      <div className="flex items-center leading-none flex-col text-red-900">
                        <IconTriangleInvertedFilled className="w-8 h-8 mb-3" />
                        <span className="font-bold font-mono">1.39K</span>
                        <span className="text-[10px]">versus</span>
                      </div>
                      <div className="flex items-center leading-none flex-col">
                        <span className="font-bold font-mono">7.03K</span>
                        <span className="text-[10px]">Selected Day</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </CarouselItem>
            ))} */}
            {carouselData.map(({ location, entries }, locIndex) => {
              // Calculate the difference
              const currentValue = (entries[0].value / 1000).toFixed(2);
              const previousValue = (entries[1].value / 1000).toFixed(2);
              const difference = (currentValue - previousValue).toFixed(2);

              // Determine if positive or negative
              const isPositive = parseFloat(difference) >= 0;
              const colorClass = isPositive ? "text-green-600" : "text-red-600";
              const IconComponent = isPositive
                ? IconTriangleFilled
                : IconTriangleInvertedFilled;

              return (
                <CarouselItem key={locIndex} className="w-full">
                  <div>
                    <CardContent className="flex flex-col items-center justify-start px-4">
                      <div className="flex flex-col items-center justify-center mb-5">
                        <span className="font-medium">{entries[0].date}</span>
                        <span className="text-2xl mb-0">{location}</span>
                      </div>
                      <div className="flex items-start w-full justify-between">
                        <div className="flex items-center leading-none flex-col">
                          <span className="font-bold font-mono">
                            {previousValue}K
                          </span>
                          <span className="text-[10px]">Previous Day</span>
                        </div>
                        <div
                          className={`flex items-center leading-none flex-col ${colorClass}`}
                        >
                          <IconComponent className="w-8 h-8 mb-3" />
                          <span className="font-bold font-mono">
                            {difference}K
                          </span>
                          <span className="text-[10px]">versus</span>
                        </div>
                        <div className="flex items-center leading-none flex-col">
                          <span className="font-bold font-mono">
                            {currentValue}K
                          </span>
                          <span className="text-[10px]">Selected Day</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </CarouselItem>
              );
            })}
            <CarouselItem className="grid grid-cols-3 place-items-center gap-3 p-4">
              <div className="flex flex-col items-center">
                <h2 className="text-base font-medium text-muted-foreground">
                  Brent
                </h2>
                <p className="text-center text-xl">$70.38</p>
                <IconDropletFilled className="w-10 h-10" />
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-base font-medium text-muted-foreground">
                  WTI
                </h2>
                <p className="text-center text-xl">$67.05</p>
                <IconDroplet className="w-10 h-10" />
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-base font-medium text-muted-foreground">
                  Flame Penalty
                </h2>
                <p className="text-center text-xl">$3.50</p>
                <IconFlameFilled className="w-10 h-10" />
              </div>
              {/* <div className="flex flex-col items-center">
                <h2 className="text-base font-medium text-muted-foreground">
                  Total String Count
                </h2>
                <p className="text-center text-xl">$3.50</p>
                <IconBarrel className="w-10 h-10" />
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-base font-medium text-muted-foreground">
                  Producing Fields
                </h2>
                <p className="text-center text-xl">$3.50</p>
                <IconFlameFilled className="w-10 h-10" />
              </div> */}
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="!left-5 !top-2" />
          <CarouselNext className="!right-5 !top-2" />
        </Carousel>
      </Card>
      {/* <Card>
        <div className="flex justify-between flex-row items-center gap-3 p-4">
          <div className="flex flex-col items-center">
            <h2 className="text-base font-medium text-muted-foreground">
              Brent
            </h2>
            <p className="text-center text-xl">$70.38</p>
            <IconDropletFilled className="w-10 h-10" />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-base font-medium text-muted-foreground">WTI</h2>
            <p className="text-center text-xl">$67.05</p>
            <IconDroplet className="w-10 h-10" />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-base font-medium text-muted-foreground">
              Flame Penalty
            </h2>
            <p className="text-center text-xl">$3.50</p>
            <IconFlameFilled className="w-10 h-10" />
          </div>
        </div>
        <div className="flex justify-between flex-row items-center gap-3 p-4">
          <div className="flex flex-col items-center">
            <h2 className="text-base font-medium text-muted-foreground">
              Flame Penalty
            </h2>
            <p className="text-center text-xl">$3.50</p>
            <IconBarrel className="w-10 h-10" />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-base font-medium text-muted-foreground">
              Flame Penalty
            </h2>
            <p className="text-center text-xl">$3.50</p>
            <IconFlameFilled className="w-10 h-10" />
          </div>
        </div>
      </Card> */}

      <Card className="col-span-full @container">
        <CardHeader className="flex flex-col items-start gap-2 space-y-0 border-b py-5 @xl:flex-row">
          <div className="grid @7xl:flex flex-1 gap-1">
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
          <div className="flex flex-col @md:flex-row gap-2">
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
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[450px] w-full"
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

              {filterT.includes("stringsUp") && (
                <Area
                  dataKey="stringsUp"
                  type="natural"
                  fill="url(#fillStringsUp)"
                  stroke="var(--color-stringsUp)"
                  stackId="a"
                />
              )}

              {filterT.includes("bsw") && (
                <Area
                  dataKey="bsw"
                  type="natural"
                  fill="url(#fillBsw)"
                  stroke="var(--color-bsw)"
                  stackId="a"
                />
              )}

              {filterT.includes("net") && (
                <Area
                  dataKey="net"
                  type="natural"
                  fill="url(#fillNet)"
                  stroke="var(--color-net)"
                  stackId="a"
                />
              )}

              {filterT.includes("gross") && (
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
