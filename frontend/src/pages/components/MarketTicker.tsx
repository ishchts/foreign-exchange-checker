import { useQuery } from "@tanstack/react-query";
import { rates } from "../../shared/api/api-client";
import { Rate } from "../../shared/api/generated/data-contracts";
import ChevronIcon from "../../app/assets/icons/icon-chevron-down.svg?react";
import { cn } from "../../shared/lib/cn";

const marketPairs = [
  { base: "USD", quote: "JPY" },
  { base: "GBP", quote: "USD" },
  { base: "USD", quote: "CHF" },
  { base: "EUR", quote: "GBP" },
  { base: "AUD", quote: "USD" },
  { base: "USD", quote: "CAD" },
];

export const MarketTicker = () => {
  const prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - 7);
  const weekAgo = prevDate.toISOString().split("T")[0];

  const { data: ratesData } = useQuery({
    queryKey: ["market-rates", marketPairs],
    queryFn: async () => {
      const pairsByBase = marketPairs.reduce<Record<string, string[]>>(
        (acc, pair) => {
          acc[pair.base] = [...(acc[pair.base] ?? []), pair.quote];
          return acc;
        },
        {},
      );

      const responses = await Promise.all(
        Object.entries(pairsByBase).map(([base, quotes]) =>
          rates.getRates({
            base,
            quotes: quotes.join(","),
            from: weekAgo,
          }),
        ),
      );

      return responses.flatMap((res) => res.data);
    },
  });
  const latestDate = ratesData?.reduce<string | null>((latest, item) => {
    if (latest === null) return item.date;
    return item.date > latest ? item.date : latest;
  }, null);

  const currentData = ratesData?.filter((el) => el.date === latestDate) ?? [];
  const prevDatas =
    ratesData?.filter((el) => latestDate && el.date < latestDate) ?? [];

  const tickerItems = marketPairs
    .map((pair) => {
      const current = currentData.find(
        (rate) => rate.base === pair.base && rate.quote === pair.quote,
      );

      if (!current) return null;

      let previous: Rate | null = null;
      for (let i = prevDatas.length - 1; i >= 0; i -= 1) {
        const rate = prevDatas[i];
        if (pair.base === rate.base && pair.quote === rate.quote) {
          previous = rate;
          break;
        }
      }

      if (previous === null) return null;

      const diff = current.rate - previous.rate;
      const percent = (diff / previous.rate) * 100;

      return {
        pair: `${current.base}/${current.quote}`,
        rate: current.rate,
        diff,
        percent,
        direction: diff >= 0 ? "up" : "down",
      };
    })
    .filter((item) => item !== null);

  const tickerRows = Array.from({ length: 4 }, () => tickerItems).flat();

  const formatRate = (rate: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: rate >= 10 ? 2 : 4,
      maximumFractionDigits: rate >= 10 ? 2 : 4,
    }).format(rate);

  const formatPercent = (percent: number) =>
    `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;

  return (
    <section
      className="flex h-10 overflow-hidden bg-[#171717]"
      aria-label="Live markets"
    >
      <div className="flex h-full w-34.5 shrink-0 items-center justify-center gap-2 bg-brand-lime text-black typography-preset-5-medium">
        <span className="h-1 w-1 rounded-full bg-black" aria-hidden="true" />
        <span>LIVE MARKETS</span>
      </div>

      <div className="flex grow overflow-hidden">
        <div className="flex market-ticker-track">
          {tickerRows.map((item, index) => (
            <div
              key={`${item.pair}-${index}`}
              className="flex min-w-52 items-center justify-between border-r border-[#2a2a2a] bg-[#171717] px-4 typography-preset-5"
            >
              <span className="text-neutral-200">{item.pair}</span>
              <span className="text-neutral-0">{formatRate(item.rate)}</span>
              <span
                className={cn("flex items-center gap-1 font-bold", {
                  "text-brand-lime": item.direction === "up",
                  "text-[#ff4d5a]": item.direction === "down",
                })}
              >
                <ChevronIcon
                  className={cn("size-3", {
                    "rotate-180": item.direction === "up",
                  })}
                  aria-hidden="true"
                />
                {formatPercent(item.percent)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
