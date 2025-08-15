import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

// In-memory cache (resets if server restarts)
let cachedData: { brent: string; naturalGas: string } | null = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute in ms

export async function GET() {
  const now = Date.now();

  if (cachedData && lastFetched && now - lastFetched < CACHE_DURATION) {
    return NextResponse.json({ prices: cachedData, cached: true });
  }

  try {
    const res = await fetch(`${process.env.COMMODITY_PRICES_URL}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US",
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    let brent = "";
    let naturalGas = "";

    $("div#div_commodity_widget div").each((_, el) => {
      const label = $(el).find(".commodity-label").text().trim();
      const price = $(el).find(".commodity-price").text().trim();

      if (label === "Brent Crude") brent = price;
      if (label === "Natural Gas") naturalGas = price;
    });

    cachedData = { brent, naturalGas };
    lastFetched = now;

    return NextResponse.json({ prices: cachedData, cached: false });
  } catch {
    if (cachedData) {
      return NextResponse.json({
        prices: cachedData,
        cached: true,
        error: "Using stale cache after failure",
      });
    }
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}
