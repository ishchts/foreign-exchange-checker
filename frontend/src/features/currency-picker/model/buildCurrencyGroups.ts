import type { Currency } from "@/shared/api/generated/data-contracts";

import {
  DISPLAY_NAME_BY_CURRENCY,
  FLAG_BY_CURRENCY,
  POPULAR_CURRENCY_CODES,
} from "./constants";
import type { CurrencyGroups, CurrencyOption } from "./types";

export const buildCurrencyGroups = (
  currencies: Currency[],
): CurrencyGroups => {
  const options = currencies
    .flatMap<CurrencyOption>((currency) => {
      const flag = FLAG_BY_CURRENCY[currency.iso_code];

      if (!flag) {
        return [];
      }

      return [
        {
          code: currency.iso_code,
          flag,
          name:
            DISPLAY_NAME_BY_CURRENCY[currency.iso_code] ?? currency.name,
        },
      ];
    })
    .sort((a, b) => a.code.localeCompare(b.code));

  const optionByCode = new Map(options.map((option) => [option.code, option]));
  const popular = POPULAR_CURRENCY_CODES.flatMap((code) => {
    const option = optionByCode.get(code);
    return option ? [option] : [];
  });
  const popularCodes = new Set(POPULAR_CURRENCY_CODES);

  return {
    popular,
    other: options.filter((option) => !popularCodes.has(option.code)),
  };
};
