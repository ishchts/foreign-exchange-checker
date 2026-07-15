import type { CurrencyPair } from "@/entities/currency-pair";
import {
  type FavoritePair,
  useFavoritePairs,
} from "@/entities/favorite-pair";
import { rates } from "@/shared/api/api-client";
import type { Rate } from "@/shared/api/generated/data-contracts";
import { cn } from "@/shared/lib/cn";
import { getAssetUrl } from "@/shared/lib/getAssetUrl";
import { useQuery } from "@tanstack/react-query";
import { Star, Triangle } from "lucide-react";
import { useMemo, useState } from "react";

type FavoritePairsProps = {
  onPairChange: (pair: CurrencyPair) => void;
};

type FavoriteRateSummary = {
  percentChange: number | null;
  rate: number;
};

const getPairKey = (base: string, quote: string) => `${base}:${quote}`;

const formatRate = (rate: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: rate >= 10 ? 2 : 4,
    maximumFractionDigits: rate >= 10 ? 2 : 4,
  }).format(rate);

const formatPercent = (percent: number) =>
  `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;

const buildRateSummaries = (rateData: Rate[]) => {
  const ratesByPair = new Map<string, Rate[]>();

  rateData.forEach((rate) => {
    const key = getPairKey(rate.base, rate.quote);
    const pairRates = ratesByPair.get(key) ?? [];
    pairRates.push(rate);
    ratesByPair.set(key, pairRates);
  });

  return new Map<string, FavoriteRateSummary>(
    [...ratesByPair.entries()].flatMap(([key, pairRates]) => {
      const sortedRates = pairRates.sort((a, b) =>
        a.date.localeCompare(b.date),
      );
      const current = sortedRates.at(-1);
      const previous = sortedRates.at(-2);

      if (!current) {
        return [];
      }

      return [
        [
          key,
          {
            rate: current.rate,
            percentChange: previous
              ? ((current.rate - previous.rate) / previous.rate) * 100
              : null,
          },
        ],
      ];
    }),
  );
};

type FavoritePairRowProps = {
  isError: boolean;
  isPending: boolean;
  onRemove: () => void;
  onSelect: () => void;
  pair: FavoritePair;
  summary?: FavoriteRateSummary;
};

const FavoritePairRow = ({
  isError,
  isPending,
  onRemove,
  onSelect,
  pair,
  summary,
}: FavoritePairRowProps) => {
  const percentChange = summary?.percentChange;
  const hasTrend = percentChange !== null && percentChange !== undefined;
  const isPositive = hasTrend && percentChange >= 0;
  const rateStatus = isPending
    ? "LOADING"
    : isError || !summary
      ? "UNAVAILABLE"
      : "NO CHANGE DATA";

  return (
    <li className="group flex min-h-[60px] items-stretch rounded-10 border border-[#2a2a2a] bg-[#1f1f1f] transition-colors hover:border-[#3a3a3a] hover:bg-[#242424]">
      <button
        type="button"
        onClick={onSelect}
        className="grid min-w-0 flex-1 cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-150 rounded-l-10 px-150 text-left outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-brand-lime md:px-200"
        aria-label={`Load ${pair.base}/${pair.quote} in converter`}
      >
        <span className="typography-preset-4 flex min-w-0 items-center gap-100 text-neutral-0">
          <span>{pair.base}</span>
          <img
            src={getAssetUrl("images/icon-arrow-right.svg")}
            alt=""
            className="size-[11px] shrink-0"
          />
          <span>{pair.quote}</span>
        </span>

        <span className="shrink-0 text-right">
          <span className="typography-preset-3 block text-neutral-0">
            {summary ? formatRate(summary.rate) : "----"}
          </span>
          <span
            className={cn(
              "typography-preset-6 mt-050 flex items-center justify-end gap-050",
              hasTrend
                ? isPositive
                  ? "text-brand-lime"
                  : "text-[#ff4d5a]"
                : "text-neutral-200",
            )}
          >
            {hasTrend ? (
              <>
                <Triangle
                  aria-hidden="true"
                  className={cn("size-100 fill-current", {
                    "rotate-180": !isPositive,
                  })}
                />
                {formatPercent(percentChange)}
              </>
            ) : (
              rateStatus
            )}
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={onRemove}
        className="m-150 ml-0 flex size-400 shrink-0 cursor-pointer items-center justify-center self-center rounded-8 border border-brand-lime text-brand-lime outline-none transition-colors hover:bg-brand-lime/15 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand-lime"
        aria-label={`Remove ${pair.base}/${pair.quote} from favorites`}
      >
        <Star aria-hidden="true" className="size-200 fill-current" />
      </button>
    </li>
  );
};

export const FavoritePairs = ({ onPairChange }: FavoritePairsProps) => {
  const [announcement, setAnnouncement] = useState("");
  const { favoritePairs, toggleFavorite } = useFavoritePairs();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const from = weekAgo.toISOString().split("T")[0];
  const favoritePairKey = favoritePairs
    .map((pair) => getPairKey(pair.base, pair.quote))
    .sort()
    .join("|");
  const {
    data: favoriteRateData = [],
    isError,
    isPending,
  } = useQuery({
    queryKey: ["favorite-pair-rates", favoritePairKey, from],
    queryFn: async () => {
      const quotesByBase = favoritePairs.reduce<Map<string, Set<string>>>(
        (result, pair) => {
          if (pair.base === pair.quote) {
            return result;
          }

          const quotes = result.get(pair.base) ?? new Set<string>();
          quotes.add(pair.quote);
          result.set(pair.base, quotes);
          return result;
        },
        new Map(),
      );
      const responses = await Promise.all(
        [...quotesByBase.entries()].map(([base, quotes]) =>
          rates.getRates({
            base,
            quotes: [...quotes].join(","),
            from,
          }),
        ),
      );

      return responses.flatMap((response) => response.data);
    },
    enabled: favoritePairs.length > 0,
  });
  const rateSummaries = useMemo(
    () => buildRateSummaries(favoriteRateData),
    [favoriteRateData],
  );

  const handleSelect = (pair: FavoritePair) => {
    onPairChange({ base: pair.base, quote: pair.quote });
    setAnnouncement(`${pair.base}/${pair.quote} loaded in converter.`);
  };

  const handleRemove = (pair: FavoritePair) => {
    toggleFavorite(pair.base, pair.quote);
    setAnnouncement(`${pair.base}/${pair.quote} removed from favorites.`);
  };

  if (favoritePairs.length === 0) {
    return (
      <div
        className="flex min-h-[320px] flex-col items-center pt-600 text-center"
        role="status"
      >
        <p className="typography-preset-2 text-neutral-0">
          No pinned pairs yet
        </p>
        <p className="typography-preset-4 mt-200 max-w-[480px] text-neutral-200">
          Pin a pair to track its rate here. Tap the star icon on any conversion
          or comparison row.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="favorite-pairs-title"
      aria-busy={isPending}
      className="rounded-16 bg-[#171717] p-200 md:rounded-20 md:p-250"
    >
      <header className="mb-200 flex items-center justify-between gap-200">
        <h2
          id="favorite-pairs-title"
          className="typography-preset-4 text-neutral-0"
        >
          PINNED PAIRS
        </h2>
        <p className="typography-preset-5 shrink-0 text-neutral-200">
          {favoritePairs.length}{" "}
          {favoritePairs.length === 1 ? "FAVORITE" : "FAVORITES"}
        </p>
      </header>

      <ul className="flex flex-col gap-150">
        {favoritePairs.map((pair) => {
          const summary =
            pair.base === pair.quote
              ? { rate: 1, percentChange: 0 }
              : rateSummaries.get(getPairKey(pair.base, pair.quote));

          return (
            <FavoritePairRow
              key={getPairKey(pair.base, pair.quote)}
              pair={pair}
              summary={summary}
              isError={isError}
              isPending={isPending}
              onSelect={() => handleSelect(pair)}
              onRemove={() => handleRemove(pair)}
            />
          );
        })}
      </ul>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
};
