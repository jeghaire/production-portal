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
import { convertToApiDateFormat } from "@/lib/utils";

// https://217.14.88.108/prod/home/dailyprod?publickey=123456789
// https://217.14.88.108/prod/home/dailystorage?publickey=123456789&datecreated=2/3/2025
// https://217.14.88.108/prod/home/dailyTank?publickey=123456789&datecreated=2/3/2025
// https://217.14.88.108/prod/home/logina?publickey=123456789&username=d&pwd=kd

async function getDailyTankLevel(date: string) {
  const res = await fetch(
    `https://217.14.88.108/prod/home/dailyTank?publickey=123456789&datecreated=${date}`
  );
  return res.json();
}

async function getDailyProductionData() {
  const res = await fetch(
    `https://217.14.88.108/prod/home/dailyprod?publickey=123456789`
  );
  return res.json();
}

async function getDailyStorageData(date: string) {
  const res = await fetch(
    `https://217.14.88.108/prod/home/dailystorage?publickey=123456789&datecreated=${date}`
  );
  return res.json();
}

// function transformStorageData(raw: RawStorageEntry[]): StorageSummary | null {
//   const entry = raw[0]; // assuming one entry per day
//   if (!entry) return null;

//   return {
//     enduranceDays: entry.endurancedays,
//     availuilage: entry.availuilage,
//   };
// }

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
    availuilage: entry.availuilage,
  };
}

export default async function ProductionDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { day = "16-06-2025" } = await searchParams;
  // Ensure day is always a string
  const dayStr = Array.isArray(day) ? day[0] : day;
  const session = await auth();

  if (!session) {
    redirect("/login"); // Redirect if no session
  }

  const dailyTankLevelData = getDailyTankLevel(convertToApiDateFormat(dayStr));
  const dailyStorageData = getDailyStorageData(convertToApiDateFormat(dayStr));
  const productionData = getDailyProductionData();

  // Initiate both requests in parallel
  const [tankLevel, prodRawData, storageRaw] = await Promise.all([
    dailyTankLevelData,
    productionData,
    dailyStorageData,
  ]);

  function transformTankData(rawData: RawTankEntry[]): TankLevelChartEntry[] {
    return rawData.map((entry) => ({
      tankID: `Tank ${entry.tanknid}`,
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
