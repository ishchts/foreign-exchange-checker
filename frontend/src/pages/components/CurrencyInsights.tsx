import type { CurrencyPair } from "@/entities/currency-pair";
import { useConversionLog } from "@/entities/conversion-log";
import { useFavoritePairs } from "@/entities/favorite-pair";
import { rates } from "@/shared/api/api-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ConversionLog } from "./ConversionLog";
import { CurrencyCompare } from "./CurrencyCompare";
import { FavoritePairs } from "./FavoritePairs";
import { RateHistoryChart } from "./RateHistoryChart";
import { RateHistoryMetrics } from "./RateHistoryMetrics";
import { RateHistoryRangeFilter, RateRange } from "./RateHistoryRangeFilter";

const getDateRange = (param: RateRange) => {
  const today = new Date();
  const fromDate = new Date(today);
  if (param === "1D") {
    fromDate.setDate(today.getDate() - 1);
  }
  if (param === "1W") {
    fromDate.setDate(today.getDate() - 7);
  }
  if (param === "1M") {
    fromDate.setMonth(today.getMonth() - 1);
  }
  if (param === "3M") {
    fromDate.setMonth(today.getMonth() - 3);
  }
  if (param === "1Y") {
    fromDate.setFullYear(today.getFullYear() - 1);
  }
  if (param === "5Y") {
    fromDate.setFullYear(today.getFullYear() - 5);
  }

  return {
    from: fromDate.toISOString().split("T")[0],
    to: today.toISOString().split("T")[0],
  };
};

type CurrencyInsightsProps = {
  amount: string;
  onPairChange: (pair: CurrencyPair) => void;
  pair: CurrencyPair;
};

export const CurrencyInsights = ({
  amount,
  onPairChange,
  pair,
}: CurrencyInsightsProps) => {
  const [activeRange, setActiveRange] = useState<RateRange>("1M");
  const { entries: conversionLogEntries } = useConversionLog();
  const { favoritePairs } = useFavoritePairs();
  const normalizedAmount = Number(amount.replace(",", "."));
  const hasValidAmount =
    amount.length > 0 &&
    Number.isFinite(normalizedAmount) &&
    normalizedAmount > 0;
  const handleActiveRange = (param: RateRange) => {
    setActiveRange(param);
  };

  const dateRange = getDateRange(activeRange);
  const {
    data: rateHistory,
    isError,
    isPending,
  } = useQuery({
    queryKey: [
      "rate-history",
      pair.base,
      pair.quote,
      dateRange.from,
      dateRange.to,
    ],
    queryFn: async () => {
      const { data } = await rates.getRates({
        base: pair.base,
        quotes: pair.quote,
        from: dateRange.from,
        to: dateRange.to,
      });

      return data;
    },
    enabled: hasValidAmount && pair.base !== pair.quote,
  });
  const hasRateHistory = Boolean(rateHistory?.length);
  const canShowHistory =
    hasValidAmount && pair.base !== pair.quote && hasRateHistory;
  const showEmptyState =
    !hasValidAmount ||
    pair.base === pair.quote ||
    isError ||
    (!isPending && !hasRateHistory);

  return (
    <section className="mt-400" aria-label="Currency insights">
      <Tabs defaultValue="HISTORY">
        <TabsList>
          <TabsTrigger className="px-150 md:px-250" value="HISTORY">
            HISTORY
          </TabsTrigger>
          <TabsTrigger className="px-150 md:px-250" value="COMPARE">
            COMPARE
          </TabsTrigger>
          <TabsTrigger className="px-150 md:px-250" value="FAVORITES">
            FAVORITES
            <span className="min-w-[20px] typography-preset-6 rounded-full bg-brand-lime/15 p-1.25 text-brand-lime">
              {favoritePairs.length}
            </span>
          </TabsTrigger>
          <TabsTrigger className="px-150 md:px-250" value="LOG">
            LOG
            <span className="min-w-[20px] typography-preset-6 rounded-full bg-brand-lime/15 p-1.25 text-brand-lime">
              {conversionLogEntries.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="HISTORY">
          {canShowHistory && rateHistory && (
            <>
              <div className="flex flex-col gap-200 lg:flex-row lg:items-center lg:justify-between">
                {rateHistory.length > 1 && (
                  <RateHistoryMetrics rate={rateHistory} />
                )}
                <RateHistoryRangeFilter
                  value={activeRange}
                  onChange={handleActiveRange}
                />
              </div>
              <RateHistoryChart data={rateHistory} range={activeRange} />
            </>
          )}
          {showEmptyState && (
            <div
              className="flex min-h-[260px] flex-col items-center pt-600 text-center"
              role="status"
            >
              <p className="typography-preset-2 text-neutral-0">
                No chart data available
              </p>
              <p className="typography-preset-4 mt-200 text-neutral-200">
                We couldn't load rate history for {pair.base}/{pair.quote} right
                now.
                <br />
                This usually clears up in a minute.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="COMPARE">
          <CurrencyCompare amount={amount} base={pair.base} />
        </TabsContent>
        <TabsContent value="FAVORITES">
          <FavoritePairs onPairChange={onPairChange} />
        </TabsContent>
        <TabsContent value="LOG">
          <ConversionLog />
        </TabsContent>
      </Tabs>
    </section>
  );
};
