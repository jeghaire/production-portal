import { useSearchParams } from "next/navigation";
import { format, startOfYear } from "date-fns";

export function DateTitle({ tabDefault = "day" }: { tabDefault?: string }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || tabDefault;
  const day = searchParams.get("day");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const today = new Date();
  const yearStart = startOfYear(today);

  let display = "";

  if (tab === "day") {
    let dateStr = day;
    if (!dateStr) {
      dateStr = format(today, "dd-MM-yyyy");
    }
    display = `${format(parseDate(dateStr), "dd MMM yyyy")}`;
  } else if (tab === "range") {
    let fromStr = from;
    let toStr = to;
    if (!fromStr && !toStr) {
      fromStr = format(yearStart, "dd-MM-yyyy");
      toStr = format(today, "dd-MM-yyyy");
    } else if (toStr && !fromStr) {
      fromStr = format(yearStart, "dd-MM-yyyy");
    } else if (fromStr && !toStr) {
      toStr = format(today, "dd-MM-yyyy");
    }
    display = `${format(parseDate(fromStr!), "dd MMM yyyy")} to ${format(parseDate(toStr!), "dd MMM yyyy")}`;
  }
  //  className="ml-2 text-xs font-normal text-muted-foreground"
  return display ? (
    <span className="min-[470]:ml-1 font-mono text-sm">- {display}</span>
  ) : null;
}

function parseDate(str: string) {
  // expects dd-MM-yyyy
  const [dd, mm, yyyy] = str.split("-");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}
