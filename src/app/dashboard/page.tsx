import ProductionDashboard from "./dashboard-page";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";
import {
  OutputFormat,
  RawDataEntry,
  RawStorageEntry,
  RawTankEntry,
  StorageSummary,
  TankLevelChartEntry,
  TransformedEntry,
} from "@/lib/definitions";
import { formatToApiDateFormat, formatToUrlDate } from "@/lib/utils";

async function getDailyTankLevel(date: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dailyTank?publickey=${process.env.NEXT_PUBLIC_API_KEY}&datecreated=${date}&limit=1000`
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Tank level fetch failed:", res.status, errorText);
      return []; // Fallback: empty array
    }

    return await res.json();
  } catch (error) {
    console.error("Tank level fetch exception:", error);
    return []; // Fallback: empty array
  }
}

async function getDailyProductionData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dailyprod?publickey=${process.env.NEXT_PUBLIC_API_KEY}`
    );

    // const res = await fetch(apiUrl, { headers });
    // console.log("Status:", res.status);
    // const text = await res.text();
    // console.log("Response Text:", text); // See actual server response

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Production data fetch failed:", res.status, errorText);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Production data fetch exception:", error);
    return [];
  }
}

async function getDailyStorageData(date: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dailystorage?publickey=${process.env.NEXT_PUBLIC_API_KEY}&datecreated=${date}`
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Storage data fetch failed:", res.status, errorText);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Storage data fetch exception:", error);
    return [];
  }
}

function formatEnduranceDays(value: number): number | string {
  // If it's a whole number, return as integer
  if (Number.isInteger(value)) return value;
  // Otherwise, round to 2 decimal places
  return value.toFixed(2);
}

function transformStorageData(raw: RawStorageEntry[]): StorageSummary | null {
  const entry = raw[0]; // assuming one entry per day
  if (!entry) return null;

  return {
    enduranceDays: formatEnduranceDays(entry.endurancedays),
    availullage: entry.availuilage,
  };
}

export default async function ProductionDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Extract the 'day' parameter from searchParams, defaulting to yesterday's date
  // If 'day' is an array, take the first element

  // If 'day' is not provided, use yesterday's date formatted as dd-MM-yyyy
  // This ensures that the date is always in the correct format for the API
  const {
    day = formatToUrlDate(
      new Date(new Date().setDate(new Date().getDate() - 1))
    ),
  } = await searchParams;
  // Ensure day is always a string
  const dayStr = Array.isArray(day) ? day[0] : day;
  const session = await auth();

  if (!session) {
    redirect("/login"); // Redirect if no session
  }

  const dailyTankLevelData = getDailyTankLevel(formatToApiDateFormat(dayStr));
  const dailyStorageData = getDailyStorageData(formatToApiDateFormat(dayStr));
  const productionData = getDailyProductionData();

  // Initiate all requests in parallel
  const [tankLevel, prodRawData, storageRaw] = await Promise.all([
    dailyTankLevelData,
    productionData,
    dailyStorageData,
  ]);

  function transformTankData(rawData: RawTankEntry[]): TankLevelChartEntry[] {
    return rawData.map((entry) => ({
      tankID: `Tank ${entry.tanknumber}`,
      water: entry.waterbottom,
      oil: entry.tanklevel, //parseFloat((entry.tanklevel - entry.waterbottom).toFixed(3)),
    }));
  }

  function transformData(data: RawDataEntry[]): OutputFormat {
    const result: OutputFormat = {};

    data.forEach((entry) => {
      // Convert the '/Date(...)' string to YYYY-MM-DD
      const timestamp = Number(entry.producedate.match(/\d+/)?.[0]); // extract number from /Date(...)
      const date = new Date(timestamp).toISOString().split("T")[0]; // format to YYYY-MM-DD

      const transformedEntry: TransformedEntry = {
        date,
        stringsUp: entry.stringsup,
        gross: entry.grossactual,
        net: entry.netactual,
        bsw: entry.bswpercent,
      };

      const fieldName = entry.fieldname.replace(/\r?\n/g, "").trim();

      if (!result[fieldName]) {
        result[fieldName] = [];
      }

      result[fieldName].push(transformedEntry);
      // if (result[fieldName].length < 2) {
      //   result[fieldName].push(transformedEntry);
      // }
    });

    return result;
  }

  const tankLevelChartData = transformTankData(tankLevel as RawTankEntry[]);
  const prodData = transformData(prodRawData as RawDataEntry[]);
  const storageData = transformStorageData(storageRaw);

  return (
    <>
      <SiteHeader title="PRODUCTION DATA" />
      <Suspense>
        <ProductionDashboard
          chartData={prodData}
          tankLevelChartData={tankLevelChartData}
          storageData={storageData}
        />
      </Suspense>
    </>
  );
}
