import { useQuery } from "@tanstack/react-query";

import { getCurrencies } from "../api/getCurrencies";
import { buildCurrencyGroups } from "./buildCurrencyGroups";
import type { CurrencyGroups } from "./types";

export const EMPTY_CURRENCY_GROUPS: CurrencyGroups = {
  other: [],
  popular: [],
};

export const useCurrencies = () =>
  useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
    select: buildCurrencyGroups,
    staleTime: Infinity,
  });
