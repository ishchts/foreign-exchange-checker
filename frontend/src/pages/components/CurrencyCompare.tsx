import { useFavoritePairs } from "@/entities/favorite-pair";
import { rates } from "@/shared/api/api-client";
import type { Rate } from "@/shared/api/generated/data-contracts";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const COMPARISON_CURRENCIES = [
  { code: "GBP", flag: "gb", name: "British Pound" },
  { code: "JPY", flag: "jp", name: "Japanese Yen" },
  { code: "CHF", flag: "ch", name: "Swiss Franc" },
  { code: "CAD", flag: "ca", name: "Canadian Dollar" },
  { code: "AUD", flag: "au", name: "Australian Dollar" },
  { code: "INR", flag: "in", name: "Indian Rupee" },
  { code: "CNY", flag: "cn", name: "Chinese Yuan" },
  { code: "BDT", flag: "bd", name: "Bangladeshi Taka" },
] as const;

const amountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const headingAmountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const rateFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
  minimumFractionDigits: 4,
});

type CurrencyCompareProps = {
  amount: string;
  base: string;
};

type ComparisonRowProps = {
  amount: number;
  base: string;
  code: string;
  flag: string;
  isFavorite: boolean;
  name: string;
  onToggleFavorite: () => void;
  rate: Rate;
};

const ComparisonRow = ({
  amount,
  base,
  code,
  flag,
  isFavorite,
  name,
  onToggleFavorite,
  rate,
}: ComparisonRowProps) => (
  <li className="grid min-h-[56px] grid-cols-[minmax(0,1fr)_auto_40px] items-center gap-100 border-t border-[#2a2a2a] px-150 md:gap-200 md:px-200">
    <div className="flex min-w-0 items-center gap-100">
      <img
        src={`/images/flags/${flag}.webp`}
        alt=""
        width={20}
        height={20}
        className="size-250 shrink-0 rounded-full object-cover"
      />
      <p className="typography-preset-5 min-w-0 truncate text-neutral-0">
        <span className="font-medium">{code}</span>
        <span className="ml-100 text-neutral-200">{name}</span>
      </p>
    </div>

    <div className="text-right">
      <p className="typography-preset-5-medium text-neutral-0">
        {amountFormatter.format(amount * rate.rate)}
      </p>
      <p className="typography-preset-6 mt-050 text-neutral-200">
        @ {rateFormatter.format(rate.rate)}
      </p>
    </div>

    <button
      type="button"
      aria-label={`${isFavorite ? "Unpin" : "Pin"} ${base}/${code} ${isFavorite ? "from" : "to"} favorites`}
      aria-pressed={isFavorite}
      onClick={onToggleFavorite}
      className="flex size-500 cursor-pointer items-center justify-center rounded-8 outline-none transition-colors hover:bg-white/5 focus-visible:ring-1 focus-visible:ring-brand-lime"
    >
      <img
        src={
          isFavorite
            ? "/images/icon-star-filled.svg"
            : "/images/icon-star.svg"
        }
        alt=""
        width={16}
        height={16}
        className="size-200"
      />
    </button>
  </li>
);

export const CurrencyCompare = ({ amount, base }: CurrencyCompareProps) => {
  const [announcement, setAnnouncement] = useState("");
  const { isFavorite, toggleFavorite } = useFavoritePairs();
  const normalizedAmount = Number(amount.replace(",", "."));
  const hasValidAmount =
    amount.length > 0 &&
    Number.isFinite(normalizedAmount) &&
    normalizedAmount > 0;
  const currencies = useMemo(
    () => COMPARISON_CURRENCIES.filter((currency) => currency.code !== base),
    [base],
  );
  const quotes = currencies.map((currency) => currency.code).join(",");
  const {
    data: comparisonRates,
    isError,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["comparison-rates", base, quotes],
    queryFn: async () => {
      const { data } = await rates.getRates({ base, quotes });
      return data;
    },
    enabled: hasValidAmount && currencies.length > 0,
  });
  const rateByQuote = useMemo(
    () =>
      new Map(
        (comparisonRates ?? []).map((comparisonRate) => [
          comparisonRate.quote,
          comparisonRate,
        ]),
      ),
    [comparisonRates],
  );
  const rows = currencies.flatMap((currency) => {
    const comparisonRate = rateByQuote.get(currency.code);
    return comparisonRate ? [{ currency, rate: comparisonRate }] : [];
  });

  const handleToggleFavorite = (quote: string) => {
    const isNowFavorite = toggleFavorite(base, quote);
    setAnnouncement(
      `${base}/${quote} ${isNowFavorite ? "pinned to" : "removed from"} favorites.`,
    );
  };

  if (!hasValidAmount) {
    return (
      <div
        className="flex min-h-[320px] flex-col items-center justify-center text-center"
        role="status"
      >
        <p className="typography-preset-2 text-neutral-0">
          Enter an amount to compare currencies
        </p>
        <p className="typography-preset-4 mt-200 max-w-[420px] text-neutral-200">
          Your send amount will appear across eight reference currencies.
        </p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div
        className="flex min-h-[320px] items-center justify-center text-center"
        role="status"
      >
        <p className="typography-preset-4 text-neutral-200">
          Loading comparison rates…
        </p>
      </div>
    );
  }

  if (isError || rows.length === 0) {
    return (
      <div
        className="flex min-h-[320px] flex-col items-center justify-center text-center"
        role="alert"
      >
        <p className="typography-preset-2 text-neutral-0">
          Couldn&apos;t load comparison rates
        </p>
        <p className="typography-preset-4 mt-200 text-neutral-200">
          Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="typography-preset-5-medium mt-300 cursor-pointer rounded-8 border border-[#3a3a3a] px-200 py-125 text-neutral-0 outline-none transition-colors hover:border-neutral-200 focus-visible:border-brand-lime"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="currency-compare-title"
      className="overflow-hidden rounded-16 bg-[#171717]"
    >
      <header className="flex min-h-[48px] items-center justify-between gap-200 px-150 md:px-200">
        <h2
          id="currency-compare-title"
          className="typography-preset-5 truncate text-neutral-0"
        >
          MULTI-CURRENCY {headingAmountFormatter.format(normalizedAmount)} FROM{" "}
          {base}
        </h2>
        <p className="typography-preset-6 shrink-0 text-neutral-200">
          {rows.length} PAIRS
        </p>
      </header>

      <ul>
        {rows.map(({ currency, rate }) => (
          <ComparisonRow
            key={currency.code}
            amount={normalizedAmount}
            base={base}
            code={currency.code}
            flag={currency.flag}
            isFavorite={isFavorite(base, currency.code)}
            name={currency.name}
            onToggleFavorite={() => handleToggleFavorite(currency.code)}
            rate={rate}
          />
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
};
