import { rates } from "@/shared/api/api-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RateHistoryMetrics } from "./RateHistoryMetrics";

const date = new Date();
const fromData = new Date();
fromData.setMonth(date.getMonth() - 1);

export const CurrencyInsights = () => {
  const [dates] = useState({
    from: fromData.toISOString().split("T")[0],
    to: date.toISOString().split("T")[0],
  });

  const { data: rateHistory } = useQuery({
    queryKey: ["rate-history"],
    queryFn: async () => {
      const { data } = await rates.getRates({
        base: "USD",
        quotes: "EUR",
        from: dates.from,
        to: dates.to,
      });

      return data;
    },
  });

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
          {rateHistory && rateHistory.length > 1 && (
            <RateHistoryMetrics rate={rateHistory} />
          )}
        </TabsContent>
        <TabsContent value="COMPARE">COMPARE</TabsContent>
        <TabsContent value="FAVORITES">FAVORITES</TabsContent>
        <TabsContent value="LOG">LOG</TabsContent>
      </Tabs>
    </section>
  );
};
