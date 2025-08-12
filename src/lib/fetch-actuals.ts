import { ChartDataEntry, LocationEntry, xProductionData, xTotals } from "./definitions";

export async function fetchActuals(date: string) {
  const url = `${process.env.API_URL}/dailyProdCum?publickey=${process.env.API_KEY}&datecreated=${date}`;
  const res = await fetch(url);

  if (!res.ok) // throw new Error("Failed to fetch actuals");
  {
     return []
  }
  
  const data = await res.json();
  
  if (!Array.isArray(data) || data.length === 0) // throw new Error("No data returned");
  {
    return [];
  }

  return Array.isArray(data) ? data[0] : data;
}

export async function fetchCumYear() {
  const url = `${process.env.API_URL}/dailyProdCumYear?publickey=${process.env.API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) // throw new Error("Failed to fetch cumulative year data");
  {
     return []
  }
  
  const data = await res.json();
  
  if (!Array.isArray(data) || data.length === 0) // throw new Error("No data returned");
  {
    return [];
  }
 return Array.isArray(data) ? data[0] : data;
}

export function getActualsWithTarget(
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

export function getProductionTotals(
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