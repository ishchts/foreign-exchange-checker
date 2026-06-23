import { useQuery } from "@tanstack/react-query";
import { currencies } from "../shared/api/api-client";

export const Home = () => {
  const { data } = useQuery({
    queryKey: ['getCurrencies'],
    queryFn: async () => {
        const res = await currencies.getCurrencies();
        return res.data;
    }
  });

  return <div>{data?.slice(0, 11).map((el) => el.iso_code)}</div>;
};
