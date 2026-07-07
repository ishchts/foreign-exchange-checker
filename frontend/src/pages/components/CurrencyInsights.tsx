import { rates } from "@/shared/api/api-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
export const CurrencyInsights = () => {
  const [activeRange, setActiveRange] = useState<RateRange>("1M");
  const handleActiveRange = (param: RateRange) => {
    setActiveRange(param);
  };

  const dateRange = getDateRange(activeRange);
  const { data: rateHistory } = useQuery({
    queryKey: ["rate-history", "USD", "EUR", dateRange.from, dateRange.to],
    queryFn: async () => {
      const { data } = await rates.getRates({
        base: "USD",
        quotes: "EUR",
        from: dateRange.from,
        to: dateRange.to,
      });

      return data;
    },
  });
  console.log('rateHistory', rateHistory);
  return (
    <section className="mt-8.25" aria-label="Currency insights">
      <Tabs defaultValue="HISTORY">
        <TabsList>
          <TabsTrigger className="px-[20px]" value="HISTORY">
            HISTORY
          </TabsTrigger>
          <TabsTrigger className="px-[20px]" value="COMPARE">
            COMPARE
          </TabsTrigger>
          <TabsTrigger className="px-[20px]" value="FAVORITES">
            FAVORITES
            <span className="min-w-[20px] typography-preset-6 rounded-full bg-brand-lime/15 p-1.25 text-brand-lime">
              10
            </span>
          </TabsTrigger>
          <TabsTrigger className="px-[20px]" value="LOG">
            LOG
            <span className="min-w-[20px] typography-preset-6 rounded-full bg-brand-lime/15 p-1.25 text-brand-lime">
              8
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="HISTORY">
          <div className="flex items-center">
            {rateHistory && rateHistory.length > 1 && (
              <RateHistoryMetrics rate={rateHistory} />
            )}
            <RateHistoryRangeFilter
              className="ml-auto mr-0"
              value={activeRange}
              onChange={handleActiveRange}
            />
          </div>
        </TabsContent>
        <TabsContent value="COMPARE">COMPARE</TabsContent>
        <TabsContent value="FAVORITES">FAVORITES</TabsContent>
        <TabsContent value="LOG">LOG</TabsContent>
      </Tabs>
    </section>
  );
};
