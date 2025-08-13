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
import { formatToApiDateFormat } from "@/lib/utils";
import { format, startOfDay, differenceInDays } from "date-fns";

async function getStaticCardData(cacheBust: number) {
  try {
    const res = await fetch(
      `${process.env.STATIC_CARD_URL}?cache-bust=${cacheBust}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}

async function getDailyTankLevel(date: string) {
  try {
    const res = await fetch(
      `${process.env.API_URL}/dailyTank?publickey=${process.env.API_KEY}&datecreated=${date}`
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function getDailyProductionData() {
  try {
    const res = await fetch(
      `${process.env.API_URL}/dailyprod?publickey=${process.env.API_KEY}`
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function getDailyStorageData(date: string) {
  try {
    const res = await fetch(
      `${process.env.API_URL}/dailystorage?publickey=${process.env.API_KEY}&datecreated=${date}`
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function getDailyProdCumData(date: string) {
  const url = `${process.env.API_URL}/dailyProdCum?publickey=${process.env.API_KEY}&datecreated=${date}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data[0];
  } catch {
    return [];
  }
}

async function getDailyProdCumYearData() {
  const url = `${process.env.API_URL}/dailyProdCumYear?publickey=${process.env.API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data[0];
  } catch {
    return [];
  }
}

async function getGasFlaringData(date: string) {
  const url = `${process.env.API_URL}/dailyGasFlared?publickey=${process.env.API_KEY}&datecreated=${date}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Convert dd-MM-yyyy to yyyy-M-d for fetchActuals
function toApiDate(str: string) {
  if (!str) return "";
  const [dd, mm, yyyy] = str.split("-");
  return `${yyyy}-${parseInt(mm)}-${parseInt(dd)}`;
}

function toApiDate2(str: string) {
  if (!str) return "";
  const [dd, mm, yyyy] = str.split("-");
  return `${parseInt(mm)}/${parseInt(dd)}/${yyyy}`;
}

function formatEnduranceDays(value: number): number | string {
  if (Number.isInteger(value)) return value;
  return value.toFixed(2);
}

function transformStorageData(raw: RawStorageEntry[]): StorageSummary | null {
  const entry = raw[0];
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
  const { day = format(new Date(), "dd-MM-yyyy") } = await searchParams;
  const session = await auth();
  if (!session) redirect("/login");

  const apiDate = formatToApiDateFormat(day.toString());
  const apiDate1 = toApiDate(day.toString());
  const apiDate2 = toApiDate2(day.toString());

  const cacheBust = Date.now();

  const [
    tankLevel,
    prodRawData,
    storageRaw,
    prodCum,
    prodCumYear,
    gasFlared,
    staticCardDataRaw,
  ] = await Promise.all([
    getDailyTankLevel(apiDate),
    getDailyProductionData(),
    getDailyStorageData(apiDate),
    getDailyProdCumData(apiDate1),
    getDailyProdCumYearData(),
    getGasFlaringData(apiDate2),
    getStaticCardData(cacheBust),
  ]);

  let staticCardData = staticCardDataRaw;
  let daysSinceLastLTI: number | null = null;

  if (staticCardData?.lastLTIDate) {
    daysSinceLastLTI = differenceInDays(
      startOfDay(new Date()),
      startOfDay(new Date(staticCardData.lastLTIDate))
    );
  }

  staticCardData = {
    ...staticCardData,
    daysSinceLastLTI,
  };

  function transformTankData(rawData: RawTankEntry[]): TankLevelChartEntry[] {
    return rawData.map((entry) => ({
      tankID: `Tank ${entry.tanknumber}`,
      water: entry.waterbottom,
      oil: entry.tanklevel,
    }));
  }

  function transformData(data: RawDataEntry[]): OutputFormat {
    const result: OutputFormat = {};
    data.forEach((entry) => {
      const timestamp = Number(entry.producedate.match(/\d+/)?.[0]);
      const d = new Date(timestamp);
      const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;

      const transformedEntry: TransformedEntry = {
        date,
        stringsTotal: entry.stringsTotal,
        stringsUp: entry.stringsup,
        gross: entry.grossactual,
        net: entry.netactual,
        bsw: entry.bswpercent,
      };

      const fieldName = entry.fieldname.replace(/\r?\n/g, "").trim();
      if (!result[fieldName]) result[fieldName] = [];
      result[fieldName].push(transformedEntry);
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
          prodCum={prodCum}
          prodCumYear={prodCumYear}
          gasFlared={gasFlared}
          staticCardData={staticCardData}
        />
      </Suspense>
    </>
  );
}
