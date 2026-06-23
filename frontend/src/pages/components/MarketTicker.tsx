import { useQuery } from "@tanstack/react-query";
import { currencies, rates } from "../../shared/api/api-client";

export const MarketTicker = () => {
  const { data } = useQuery({
    queryKey: [rates.getRates.name],
    queryFn: async () => {
      const res = await rates.getRates({ base: "USD", quotes: "EUR,GBP,JPY,RUB" });
      return res.data;
    },
  });
  console.log('data', data);
  return (
    <div className="flex h-10">
      <div className="bg-lime-500 h-full text-[12px]  w-[124px] text-black flex justify-center items-center">
        LIVE MARKETS
      </div>
      <div>list</div>
    </div>
  );
};
