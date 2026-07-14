import { currencies } from "@/shared/api/api-client";

export const getCurrencies = async () => {
  const { data } = await currencies.getCurrencies();
  return data;
};
