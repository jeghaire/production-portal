"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn, formatToApiDateFormat, formatToUrlDate } from "@/lib/utils";
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
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductionCard } from "@/components/dashboard/production-card";
import { LocationDifferenceCard } from "@/components/dashboard/location-difference-card";
import { TankLevelChart } from "@/components/tank-level";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseUrlDate } from "@/components/filters";
import { TFPIncidentChart } from "@/components/tfp-incidents-chart";
import {
  ChartDataEntry,
  LocationEntry,
  OutputFormat,
  StorageSummary,
  TankLevelChartEntry,
  xProductionData,
  xTotals,
} from "@/lib/definitions";
import { subDays } from "date-fns";
import { GasFlaringTable } from "@/components/gas-flaring-card";

function getActualsWithTarget(
  data: Record<string, ChartDataEntry[]>,
  netTargetByLocation: Record<string, number>,
  targetDay: string
): LocationEntry[] {
  const targetDate = new Date(targetDay);

  return Object.keys(data).map((location) => {
    const entries = [...data[location]].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const match = entries.find(
      (item) => new Date(item.date).toDateString() === targetDate.toDateString()
    );

    return {
      location,
      entry: match
        ? {
            date: new Date(match.date).toLocaleDateString("en-GB"),
            value: match.net,
          }
        : null,
      target: netTargetByLocation[location] ?? 0,
    };
  });
}

function getProductionTotals(
  data: xProductionData,
  selectedDate: string
): xTotals {
  let totalGrossForDay = 0;
  let totalNetForDay = 0;
  let cumulativeNetUpToDate = 0;

  const selected = new Date(selectedDate);
  const selectedYearStart = new Date(selected.getFullYear(), 0, 1); // Jan 1st

  for (const entries of Object.values(data)) {
    for (const entry of entries) {
      const entryDate = new Date(entry.date);

      // Total for the selected day
      if (entryDate === selected) {
        totalGrossForDay += entry.gross;
        totalNetForDay += entry.net;
      }

      // Cumulative total net from Jan 1 to selectedDate (inclusive)
      if (entryDate >= selectedYearStart && entryDate <= selected) {
        cumulativeNetUpToDate += entry.net;
      }
    }
  }

  return {
    totalGrossForDay: Number(totalGrossForDay.toFixed(2)),
    totalNetForDay: Number(totalNetForDay.toFixed(2)),
    cumulativeNetUpToDate: Number(cumulativeNetUpToDate.toFixed(2)),
  };
}

const netTargetByLocation: Record<string, number> = {
  AFIESERE: 8706.18,
  ERIEMU: 8552.08,
  EVWRENI: 742.29,
  KOKORI: 7413.71,
  OLOMORO: 19787.31,
  ORONI: 2655.44,
  OWEH: 7641.43,
  "UZERE WEST": 3471.81,
  "UZERE EAST (OML 30 - 14.695%)": 0,
  "UZERE EAST (100%)": 0,
};

// const NET_TARGET = 48571;

const loc = [
  { label: "AFIESERE", value: "AFIESERE" },
  { label: "ERIEMU", value: "ERIEMU" },
  { label: "EVWRENI", value: "EVWRENI" },
  { label: "KOKORI", value: "KOKORI" },
  { label: "OLOMORO", value: "OLOMORO" },
  { label: "ORONI", value: "ORONI" },
  { label: "OWEH", value: "OWEH" },
  { label: "UZERE WEST", value: "UZERE WEST" },
  {
    label: "UZERE EAST (OML 30 - 14.695%)",
    value: "UZERE EAST (OML 30 - 14.695%)",
  },
  {
    label: "UZERE EAST (100%)",
    value: "UZERE EAST (100%)",
  },
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

const productionCardData = [
  {
    title: "Gross Liquid Production",
    badgeValue: "53%",
    badgeIcon: <IconArrowUp className="!h-4 !w-4 mr-1" />,
    description: "Barrels of Liquid Per Day",
    quantity: 170420,
    percentOfTarget: 60,
    progressValue: 60,
    unit: "blpd",
  },
  {
    title: "Net Oil Production",
    badgeValue: "46%",
    badgeIcon: <IconArrowUp className="!h-4 !w-4 mr-1" />,
    description: "Barrels of Oil Per Day",
    quantity: 45240,
    percentOfTarget: 76,
    progressValue: 76,
    unit: "bopd",
  },
  // {
  //   title: "Year to Date Oil Production",
  //   badgeValue: "12%",
  //   badgeIcon: <IconArrowUp className="!h-4 !w-4 mr-1" />,
  //   description: "Barrels of Oil",
  //   quantity: 3143740.26,
  //   percentOfTarget: 27.5,
  //   progressValue: 27.5,
  //   unit: "bbls",
  //   footer: (
  //     <div className="flex items-center gap-2">
  //       <IconAlertCircleFilled className="w-3.5" />
  //       <p className="text-xs text-muted-foreground">
  //         Prices are subject to the rate of the US dollar!
  //       </p>
  //     </div>
  //   ),
  // },
];

const tankLevelChartConfig = {
  water: {
    label: "Water Level",
    color: "var(--color-cyan-700)",
  },
  oil: {
    label: "Oil Level",
    color: "var(--color-red-800)",
  },
} satisfies ChartConfig;

type Props = {
  chartData: OutputFormat;
  tankLevelChartData: TankLevelChartEntry[];
  storageData: StorageSummary | null;
};

export default function ProductionDashboard({
  chartData,
  tankLevelChartData,
  storageData,
}: Props) {
  // const [selectedLocation, setSelectedLocation] = React.useState("EVWRENI");
  const [open, setOpen] = React.useState(false);
  const [openT, setOpenT] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  // Get initial tab from URL (default to 'day')
  const initialTab = searchParams.get("tab") || "day";

  // Local state for immediate tab changes
  const [activeTab, setActiveTab] = React.useState(initialTab);

  // Extract selected locations from query params
  const selectedQueryParams = searchParams.getAll("loc");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const dayFromURL =
    searchParams.get("day") || formatToUrlDate(subDays(new Date(), 1));
  // console.dir(chartData, { depth: null });

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

  React.useEffect(() => {
    const incoming = selectedQueryParams.length > 0 ? selectedQueryParams : [];
    setSelectedValues((prev) =>
      JSON.stringify(prev) !== JSON.stringify(incoming) ? incoming : prev
    );
  }, [selectedQueryParams]);

  const fromDate = from ? parseUrlDate(from) : null;
  const toDate = to ? parseUrlDate(to) : null;

  const tableData = Object.entries(chartData)
    .flatMap(([key, items]) =>
      items.map((item) => ({ ...item, location: key }))
    )
    .filter((item) => {
      const itemDate = new Date(item.date);
      return (
        (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function formatDateToDDMMYYYY(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // day with leading zero
    const month = String(date.getMonth() + 1).padStart(2, "0"); // month with leading zero (0-based)
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const tableDataDaily = Object.entries(chartData)
    .flatMap(([key, items]) =>
      items.map((item) => ({ ...item, location: key }))
    )
    .filter((item) => {
      const formattedItemDate = formatDateToDDMMYYYY(item.date);
      return formattedItemDate === dayFromURL;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredChartData: Record<string, any[]> = {};

  Object.entries(chartData).forEach(([location, entries]) => {
    filteredChartData[location] = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        (!fromDate || entryDate >= fromDate) && (!toDate || entryDate <= toDate)
      );
    });
  });

  const result = getProductionTotals(
    chartData,
    formatToApiDateFormat(dayFromURL)
  );
  // console.log("Result/n", result);

  const getAggregatedData = (filteredData: Record<string, any[]>) => {
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
            netTarget: 0,
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
        aggregatedData[index].stringsUp += entry.stringsUp;
        // aggregatedData[index].netTarget = NET_TARGET;

        // Add netTarget from current location
        aggregatedData[index].netTarget += netTargetByLocation[location] || 0;
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

  const aggregatedData = getAggregatedData(filteredChartData);

  const carouselData = getActualsWithTarget(
    chartData,
    netTargetByLocation,
    formatToApiDateFormat(dayFromURL)
  );

  // Sync local state when URL changes (like back/forward navigation)
  React.useEffect(() => {
    const urlTab = searchParams.get("tab") || "day";
    setActiveTab(urlTab);
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    // Update local state immediately for responsive UI
    setActiveTab(newTab);

    // Update URL in the background
    const params = new URLSearchParams(searchParams);
    params.set("tab", newTab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <Tabs
        defaultValue="day"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <div className="flex flex-col sm:flex-row sm:items-end">
          <TabsList className="m-4 mb-0">
            <TabsTrigger value="day">By Day</TabsTrigger>
            <TabsTrigger value="range">By Range</TabsTrigger>
          </TabsList>
          {/* {activeTab === "day" && (
            <div className="flex ml-auto text-sm mr-5 mt-6 sm:mt-0 space-x-2">
              {[
                { text: "WTI", value: 73.06 },
                { text: "Brent", value: 74.68 },
              ].map(({ text, value }) => (
                <p key={text}>
                  {text}:
                  <span className="font-medium text-base ml-1 font-mono">
                    ${value}
                  </span>
                </p>
              ))}
            </div>
          )} */}
        </div>

        <TabsContent value="day">
          <section className="p-4 grid grid-cols-1 @xl:grid-cols-2 @6xl:grid-cols-4 @7xl:grid-cols-4 gap-3">
           <div className="col-span-full">
              <Card>
              <div className="flex ml-auto text-sm mr-5 mt-6 sm:mt-0 space-x-2">
              {[
                { text: "Natural Gas", value: "$3.37" },
                { text: "Brent", value: "$69.25" },
                { text: "Days since last LTI", value: "618" },
                { text: "TFP Incidents YTD", value:  "12 MECH.| 1 TPI"},
                { text: "Rotating Equipment Availability", value: "90%" },
              ].map(({ text, value }) => (
                <p key={text}>
                  {text}:
                  <span className="font-medium text-base ml-1 font-mono">
                    {value}
                  </span>
                </p>
              ))}
            </div>
              </Card>
            </div>
            {productionCardData.map((item, index) => (
              <ProductionCard key={index} {...item} />
            ))}
            <ProductionCard
              title="Year to Date Oil Production"
              description="Barrels of Oil"
              quantity={result.cumulativeNetUpToDate}
              percentOfTarget={27.5}
              progressValue={27.5}
              unit="bbls"
            />
            <Card>
              <Carousel className="w-full">
                <CarouselContent>
                  {carouselData.map(({ location, entry, target }) => (
                    <CarouselItem key={location} className="w-full">
                      <LocationDifferenceCard
                        location={location}
                        entry={entry}
                        target={target}
                        selectedDate={dayFromURL}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="!left-5 !top-2" />
                <CarouselNext className="!right-5 !top-2" />
              </Carousel>
            </Card>
            <div className="col-span-1 md:col-span-2">
              <TankLevelChart
                title="UPS Tank Levels"
                description="Showing water and oil levels in tanks"
                chartConfig={tankLevelChartConfig}
                chartData={tankLevelChartData}
              />
            </div>
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 p-0 gap-3">
              {/* <div className="col-span-1"> */}
              <div className="rounded-lg h-full grid gap-2 grid-cols-2">
                <Card className="col-span-1 gap-0 p-3 flex flex-col justify-between">
                  <CardTitle>Endurance Time</CardTitle>
                  <p className="font-bold text-2xl">
                    {storageData?.enduranceDays || 0}
                    <span className="ml-1 text-base tracking-tighter font-normal text-muted-foreground">
                      days
                    </span>
                  </p>
                </Card>
                <Card className="col-span-1 gap-0 p-3 flex flex-col justify-between">
                  <CardTitle>Available Ullage</CardTitle>
                  <p className="font-bold text-2xl">
                    {storageData?.availullage || 0}
                    <span className="ml-1 text-base tracking-tighter font-normal text-muted-foreground">
                      bbls
                    </span>
                  </p>
                </Card>
                <Card className="col-span-1 gap-0 p-3 flex flex-col justify-between">
                  <CardTitle>TFP Total Injectors</CardTitle>
                  <p className="font-bold text-2xl">
                    394,367
                    <span className="ml-1 text-base tracking-tighter font-normal text-muted-foreground">
                      bbls
                    </span>
                  </p>
                </Card>
                <Card className="col-span-1 gap-0 p-3 flex flex-col justify-between">
                  <CardTitle>FRM Total</CardTitle>
                  <p className="font-bold text-2xl">
                    389,314
                    <span className="ml-1 text-base tracking-tighter font-normal text-muted-foreground">
                      bbls
                    </span>
                  </p>
                </Card>
              </div>
              {/* </div> */}
              <div className="col-span-1">
                {/* <TFPIncidentChart /> */}
                <GasFlaringTable/>
              </div>
            </div>
            <div className="col-span-full print:hidden">
              <DataTable data={tableDataDaily} columns={columns} />
            </div>
          </section>
        </TabsContent>
        <TabsContent value="range">
          <section className="p-5 grid grid-cols-1 @xl:grid-cols-2 @6xl:grid-cols-4 @7xl:grid-cols-4 gap-3">
            <Card
              className="col-span-full @container scroll-mt-8 pb-0 !gap-0"
              id="chart"
            >
              <CardHeader className="flex flex-col @max-md:px-5 @xl:flex-row">
                <div className="flex flex-col space-y-1 space-x-1 @7xl:flex-row flex-1">
                  <CardTitle>OML 30 Production Perfomance</CardTitle>
                  {/* <CardDescription>
                Showing total Oil Production for {selectedMonth[0] || "January"}{" "}
                {selectedYear[0] || 2025}
              </CardDescription> */}
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
                <div className="flex max-md:mt-2 md:flex-col flex-wrap gap-2 @md:flex-row print:hidden">
                  <Popover open={openT} onOpenChange={setOpenT}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full md:w-[200px] justify-between"
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
                        className="w-full md:w-[200px] justify-between"
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
                                onSelect={() =>
                                  toggleSelection(framework.value)
                                }
                              >
                                <IconCheck
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
              {aggregatedData.length > 0 ? (
                <>
                  <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto h-[500px] w-full pb-5"
                    >
                      {/* <AreaChart data={chartData[selectedLocation]}> */}
                      <AreaChart
                        data={aggregatedData}
                        syncId="chartSync"
                        className="h-full"
                      >
                        <defs>
                          <linearGradient
                            id="fillNet"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
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
                          <linearGradient
                            id="fillGross"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
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
                            return date.toLocaleDateString("en-GB");
                          }}
                        />
                        {/* {!isMobile && ( */}
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={5}
                          tickCount={5}
                          label={{
                            value: "Oil Rate and Gross (blpd)",
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
                                return new Date(value).toLocaleDateString(
                                  "en-GB"
                                );
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
                            dot={
                              !isMobile && {
                                fill: "var(--color-gross)",
                                fillOpacity: 1,
                                r: 1.5,
                              }
                            }
                            activeDot={{
                              r: 4,
                            }}
                          />
                        )}
                        {filterT.includes("net") && (
                          <Area
                            dataKey="net"
                            type="natural"
                            // fill="url(#fillNet)"
                            fill="var(--color-net)"
                            fillOpacity={1}
                            stroke={`hsl(0 70% 35.3%)`}
                            // stroke={`hsl(0 74.7% 15.5%)`}
                            // stroke="var(--color-net)"
                            strokeWidth={2}
                            dot={
                              !isMobile && {
                                fill: "var(--color-net)",
                                fillOpacity: 1,
                                r: 1.5,
                              }
                            }
                            activeDot={{
                              r: 4,
                            }}
                          />
                        )}

                        <Area
                          dataKey="netTarget"
                          type="natural"
                          stroke="var(--color-netTarget)"
                          strokeWidth={2}
                          fill="none"
                          strokeDasharray={"5 5"}
                          activeDot={{
                            r: 0,
                          }}
                        />
                        <ChartLegend
                          verticalAlign="top"
                          content={<ChartLegendContent />}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </>
              ) : (
                <div className="text-sm grid place-items-center h-full hover:bg-muted/50 transition-colors min-h-[520]">
                  <span className="m-3">
                    No data available for the selected time period and
                    locations.
                  </span>
                </div>
              )}
            </Card>
            <Card className="col-span-full @7xl:col-span-2 pb-0">
              <CardHeader>
                <CardTitle>String Status</CardTitle>
                {/* <CardDescription>{`Chart Data displayed for ${fromDate} to ${toDate}`}</CardDescription> */}
              </CardHeader>
              {aggregatedData.length > 0 ? (
                <>
                  <CardContent>
                    <ChartContainer
                      config={chartConfig}
                      className="h-[400px] w-full pb-5"
                    >
                      <LineChart
                        syncId="chartSync"
                        accessibilityLayer
                        data={aggregatedData}
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
                            return date.toLocaleDateString("en-GB");
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
                                return new Date(value).toLocaleDateString(
                                  "en-GB"
                                );
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
                          dot={
                            !isMobile && {
                              fill: "var(--color-stringsUp)",
                              r: 1,
                            }
                          }
                          activeDot={{
                            r: 4,
                          }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                  {/* <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm mb-4">
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
              </CardFooter> */}
                </>
              ) : (
                <div className="text-sm grid place-items-center h-full hover:bg-muted/50 transition-colors min-h-[320]">
                  <span className="m-3">
                    No data available for the selected time period and
                    locations.
                  </span>
                </div>
              )}
            </Card>
            <Card className="col-span-full @7xl:col-span-2 pb-0">
              <CardHeader>
                <CardTitle>Basic Sediment and Water</CardTitle>
                {/* <CardDescription>{`Chart Data displayed for ${fromDate} to ${toDate}`}</CardDescription> */}
              </CardHeader>
              {aggregatedData.length > 0 ? (
                <>
                  <CardContent>
                    <ChartContainer
                      config={chartConfig}
                      className="h-[400px] w-full pb-5"
                    >
                      <LineChart
                        syncId="chartSync"
                        accessibilityLayer
                        // data={chartDataLine}
                        data={aggregatedData}
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
                            return date.toLocaleDateString("en-GB");
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
                                return new Date(value).toLocaleDateString(
                                  "en-GB"
                                );
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
                          dot={
                            !isMobile && {
                              fill: "var(--color-bsw)",
                              r: 1,
                            }
                          }
                          activeDot={{
                            r: 4,
                          }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                  {/* <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm mb-4">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      Trending up by 5.2% this month
                    </div>
                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                      Showing total bsw of the selected locations for the
                      selected month
                    </div>
                  </div>
                </div>
              </CardFooter> */}
                </>
              ) : (
                <div className="text-sm grid place-items-center h-full hover:bg-muted/50 transition-colors min-h-[320]">
                  <span className="m-3">
                    No data available for the selected time period and
                    locations.
                  </span>
                </div>
              )}
            </Card>
            <div className="col-span-full print:hidden">
              <DataTable data={tableData} columns={columns} />
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </>
  );
}
