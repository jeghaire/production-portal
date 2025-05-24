"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
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
import { IconArrowUp, IconCheck, IconSelector } from "@tabler/icons-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SiteHeader } from "@/components/site-header";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
// import { useIsMobile } from "@/hooks/use-mobile";
import { ProductionCard } from "@/components/dashboard/production-card";
import { LocationDifferenceCard } from "@/components/dashboard/location-difference-card";

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
  { label: "NET", value: "net" },
  { label: "GROSS", value: "gross" },
];

const chartConfig = {
  bsw: {
    label: "BSW",
    color: "hsl(var(--chart-bsw))",
  },
  gross: {
    label: "Gross",
    color: "hsl(var(--chart-gross))",
  },
  net: {
    label: "Oil Rate",
    color: "hsl(var(--chart-net))",
  },
  stringsUp: {
    label: "Strings Up",
    color: "hsl(var(--chart-stringsup))",
  },
  netTarget: {
    label: "Net Target",
    color: "hsl(var(--chart-stringsup))",
  },
} satisfies ChartConfig;

const NET_TARGET = 48571;

const productionData = [
  {
    title: "Production Status",
    badgeValue: "46%",
    badgeIcon: <IconArrowUp className="!h-4 !w-4 mr-1" />,
    description: "BPOD/Barrels per day",
    quantity: 45240,
    percentOfTarget: 76,
    progressValue: 76,
    // footer: (
    //   <div className="flex items-center gap-2">
    //     <IconAlertCircleFilled className="w-3.5" />
    //     <p className="text-xs text-muted-foreground">
    //       Prices are subject to the rate of the US dollar!
    //     </p>
    //   </div>
    // ),
  },
  {
    title: "Gross Production",
    badgeValue: "53%",
    badgeIcon: <IconArrowUp className="!h-4 !w-4 mr-1" />,
    description: "Gross production per day",
    quantity: 170420,
    percentOfTarget: 60,
    progressValue: 60,
  },
  {
    title: "Net Production",
    badgeValue: "12%",
    badgeIcon: <IconArrowUp className="!h-4 !w-4 mr-1" />,
    description: "Net production YTD",
    quantity: 3143740.26,
    percentOfTarget: 27.5,
    progressValue: 27.5,
  },
];

export default function Component() {
  // const [selectedLocation, setSelectedLocation] = React.useState("EVWRENI");
  const [open, setOpen] = React.useState(false);
  const [openT, setOpenT] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  // const isMobile = useIsMobile();

  // Extract selected locations from query params
  const selectedQueryParams = searchParams.getAll("loc");
  const selectedMonth = searchParams.getAll("mnt");
  const selectedYear = searchParams.getAll("yr");

  // Set initial state from query params
  const [selectedValues, setSelectedValues] = React.useState(
    selectedQueryParams.length > 0 ? selectedQueryParams : []
  );
  const [filterT, setFilterT] = React.useState(["net", "gross"]);

  // Function to update selected locations
  const toggleSelection = (currentValue: string) =>
    setSelectedValues((prev) => {
      const newSelectedValues = prev.includes(currentValue)
        ? prev.filter((value) => value !== currentValue)
        : [...prev, currentValue];

      // Update the URL query parameters
      const params = new URLSearchParams(searchParams);
      params.delete("loc");
      newSelectedValues.forEach((value) => params.append("loc", value));

      router.replace(`?${params.toString()}`, { scroll: false });

      return newSelectedValues;
    });

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
  // }, [selectedQueryParams]);

  React.useEffect(() => {
    const incoming = selectedQueryParams.length > 0 ? selectedQueryParams : [];
    setSelectedValues((prev) =>
      JSON.stringify(prev) !== JSON.stringify(incoming) ? incoming : prev
    );
  }, [selectedQueryParams]);

  // Function to aggregate data based on selected locations
  // const getAggregatedData = () => {
  //   const locations =
  //     selectedValues.length > 0 ? selectedValues : Object.keys(chartData);

  //   const aggregatedData: Record<string, any>[] = [];

  //   locations.forEach((location) => {
  //     filteredData[location].forEach((entry: any, index: number) => {
  //       if (!aggregatedData[index]) {
  //         aggregatedData[index] = {
  //           date: entry.date,
  //           bsw: 0,
  //           net: 0,
  //           gross: 0,
  //           stringsUp: 0,
  //         };
  //       }
  //       aggregatedData[index].bsw += entry.bsw;
  //       aggregatedData[index].net += entry.net;
  //       aggregatedData[index].gross += entry.gross;
  //       aggregatedData[index].stringsUp += entry.stringsUp;
  //     });
  //   });

  //   return aggregatedData;
  // };

  const getAggregatedData = () => {
    const locations =
      selectedValues.length > 0 ? selectedValues : Object.keys(chartData);
    const aggregatedData: Record<string, any>[] = [];

    locations.forEach((location) => {
      filteredData[location].forEach((entry: any, index: number) => {
        if (!aggregatedData[index]) {
          aggregatedData[index] = {
            date: entry.date,
            bsw: 0,
            net: 0,
            gross: 0,
            stringsUp: 0,
            // New temporary variables for BSW calculation
            _totalWaterVolume: 0,
            _totalLiquidVolume: 0,
          };
        }

        // For BSW, we need to calculate water volume and sum it properly
        const waterVolume = entry.gross * (entry.bsw / 100);
        aggregatedData[index]._totalWaterVolume += waterVolume;
        aggregatedData[index]._totalLiquidVolume += entry.gross;

        // Other metrics can be summed directly
        aggregatedData[index].net += entry.net;
        aggregatedData[index].gross += entry.gross;
        aggregatedData[index].netTarget = NET_TARGET;
        aggregatedData[index].stringsUp += entry.stringsUp;
      });
    });

    // Now calculate the actual BSW percentage for each time period
    aggregatedData.forEach((entry) => {
      if (entry._totalLiquidVolume > 0) {
        entry.bsw = (entry._totalWaterVolume / entry._totalLiquidVolume) * 100;
      } else {
        entry.bsw = 0; // Handle division by zero case
      }
      // Remove the temporary variables (optional)
      delete entry._totalWaterVolume;
      delete entry._totalLiquidVolume;
    });

    return aggregatedData;
  };

  const result: Record<string, { date: string; net: number }[]> = {};
  const data = { ...chartData };

  for (const key in data) {
    // Ensure TypeScript knows key is a valid key of data
    const sorted = [...data[key as keyof typeof data]].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    // Take the first two elements (most recent dates)
    result[key] = sorted.slice(0, 2);
  }

  const carouselData = Object.entries(result).map(([location, items]) => ({
    location, // "AFIESERE", "ERIEMU", etc.
    entries: items.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-GB"), // "DD/MM/YYYY"
      value: item.net, // or item.gross, item.stringsUp, etc.
      rawData: item, // Keep original data for calculations
    })),
  }));

  const tableData = Object.entries(chartData)
    .flatMap(([key, items]) =>
      items.map((item) => ({ ...item, location: key }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function getMonthDataByName(
    data: Record<
      string,
      {
        date: string;
        bsw: number;
        net: number;
        gross: number;
        stringsUp: number;
      }[]
    >,
    monthName: string,
    year: number
  ) {
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

    // Filter data for the selected month
    const filteredData = Object.keys(data).reduce(
      (acc, location) => {
        acc[location] = data[location].filter((entry) => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getMonth() === monthIndex &&
            entryDate.getFullYear() === year
          );
        });
        return acc;
      },
      {} as Record<
        string,
        {
          date: string;
          bsw: number;
          net: number;
          gross: number;
          stringsUp: number;
        }[]
      >
    );

    // Check if the total number of entries is less than 20
    // const totalEntries = Object.values(filteredData).flat().length;

    // if (totalEntries < 20) {
    //   // Get data from the previous month
    //   const previousMonthIndex = (monthIndex - 1 + 12) % 12;
    //   const previousYear = monthIndex === 0 ? year - 1 : year;

    //   const previousMonthData = Object.keys(data).reduce((acc, location) => {
    //     acc[location] = data[location].filter((entry) => {
    //       const entryDate = new Date(entry.date);
    //       return (
    //         entryDate.getMonth() === previousMonthIndex &&
    //         entryDate.getFullYear() === previousYear
    //       );
    //     });
    //     return acc;
    //   }, {});

    //   // Merge data from the selected month and the previous month
    //   Object.keys(filteredData).forEach((location) => {
    //     filteredData[location] = [
    //       ...filteredData[location],
    //       ...(previousMonthData[location] || []),
    //     ];
    //   });
    // }

    return filteredData;
  }

  // Usage:
  const filteredData: Record<
    string,
    {
      date: string;
      bsw: number;
      net: number;
      gross: number;
      stringsUp: number;
    }[]
  > = getMonthDataByName(
    chartData,
    selectedMonth.length ? selectedMonth[0].slice(0, 3) : "Jan",
    selectedYear.length ? Number(selectedYear[0]) : 2025
  );

  return (
    <>
      <SiteHeader title="GAS/OIL PRODUCTION DATA" />
      <section className="p-5 grid grid-cols-1 @xl:grid-cols-2 @6xl:grid-cols-4 @7xl:grid-cols-4 gap-3">
        {productionData.map((item, index) => (
          <ProductionCard key={index} {...item} />
        ))}
        <Card>
          <Carousel className="w-full">
            <CarouselContent>
              {carouselData.map(({ location, entries }, locIndex) => (
                <CarouselItem key={locIndex} className="w-full">
                  <LocationDifferenceCard
                    location={location}
                    entries={entries}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="!left-5 !top-2" />
            <CarouselNext className="!right-5 !top-2" />
          </Carousel>
        </Card>

        <Card className="col-span-full @container scroll-mt-8" id="chart">
          <CardHeader className="flex flex-col items-start gap-2 space-y-0 border-b py-5 @xl:flex-row">
            <div className="flex flex-col @7xl:flex flex-1 gap-1">
              <CardTitle>Gas/Oil Production</CardTitle>
              <CardDescription>
                Showing total Oil Production for {selectedMonth[0] || "January"}{" "}
                {selectedYear[0] || 2025}
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
            <div className="flex flex-col @md:flex-row gap-2 print:hidden">
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
                                loc.find(
                                  (framework) => framework.value === value
                                )?.label
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
              className="aspect-auto h-[500px] w-full"
            >
              {/* <AreaChart data={chartData[selectedLocation]}> */}
              <AreaChart
                data={getAggregatedData()}
                syncId="chartSync"
                className="h-full"
              >
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
                {/* {!isMobile && ( */}
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={5}
                  tickCount={5}
                  label={{
                    value: "Gross & Net (bbls)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  tickFormatter={(tickItem) => {
                    if (tickItem >= 1000) {
                      return tickItem / 1000 + "k";
                    }
                    return tickItem;
                  }}
                />
                {/* )} */}
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className="min-w-[170px] p-2"
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
                {filterT.includes("gross") && (
                  <Area
                    dataKey="gross"
                    type="natural"
                    // fill="url(#fillGross)"
                    fill="var(--color-gross)"
                    stroke="var(--color-gross)"
                    strokeWidth={2}
                    // dot={false}
                    dot={{
                      fill: "var(--color-gross)",
                      fillOpacity: 1,
                    }}
                    activeDot={{
                      r: 5,
                    }}
                  />
                )}
                {filterT.includes("net") && (
                  <Area
                    dataKey="net"
                    type="natural"
                    // fill="url(#fillNet)"
                    fill="var(--color-net)"
                    stroke="var(--color-net)"
                    strokeWidth={2}
                    // dot={false}
                    dot={{
                      fill: "var(--color-net)",
                      fillOpacity: 1,
                    }}
                    activeDot={{
                      r: 5,
                    }}
                  />
                )}

                <Area
                  dataKey="netTarget"
                  type="natural"
                  stroke="var(--color-netTarget)"
                  strokeWidth={2}
                  fill="none"
                  // dot={false}
                  strokeDasharray={"5 5"}
                  activeDot={{
                    r: 0,
                  }}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-full @7xl:col-span-2">
          <CardHeader>
            <CardTitle>Strings Up by Day</CardTitle>
            <CardDescription>
              {selectedMonth[0] || "January"} {selectedYear[0] || 2025}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart
                syncId="chartSync"
                accessibilityLayer
                // data={chartDataLine}
                data={getAggregatedData()}
                margin={{
                  right: 4,
                  top: 4,
                  bottom: 4,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={18}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
                {/* {!isMobile && ( */}
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={16}
                  tickCount={4}
                  type="number"
                  domain={["dataMin", "auto"]}
                  // allowDataOverflow={true}
                  label={{
                    value: "Strings Up",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                {/* )} */}
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
                <Line
                  dataKey="stringsUp"
                  type="natural"
                  stroke="var(--color-stringsUp)"
                  strokeWidth={2}
                  // dot={false}
                  dot={{
                    fill: "var(--color-stringsUp)",
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Showing total strings up of the selected locations for the
                  selected month
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="col-span-full @7xl:col-span-2">
          <CardHeader>
            <CardTitle>Basic Sediment and Water (%) by Day</CardTitle>
            <CardDescription>
              {selectedMonth[0] || "January"} {selectedYear[0] || 2025}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart
                syncId="chartSync"
                accessibilityLayer
                // data={chartDataLine}
                data={getAggregatedData()}
                margin={{
                  right: 4,
                  top: 4,
                  bottom: 4,
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
                {/* {!isMobile && ( */}
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={16}
                  tickCount={4}
                  type="number"
                  domain={["dataMin", "auto"]}
                  // allowDataOverflow={true}
                  label={{
                    value: "BSW (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                {/* )} */}
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
                <Line
                  dataKey="bsw"
                  type="natural"
                  stroke="var(--color-bsw)"
                  strokeWidth={2}
                  // dot={false}
                  dot={{
                    fill: "var(--color-bsw)",
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Showing total bsw of the selected locations for the selected
                  month
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <div className="col-span-full print:hidden">
          <DataTable data={tableData} columns={columns} />
        </div>
      </section>
    </>
  );
}
