import { useConversionLog } from "@/entities/conversion-log";
import type { CurrencyPair } from "@/entities/currency-pair";
import { useFavoritePairs } from "@/entities/favorite-pair";
import { CurrencyPicker } from "@/features/currency-picker";
import { rates } from "@/shared/api/api-client";
import { cn } from "@/shared/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type CurrencyConverterProps = {
  amount: string;
  onAmountChange: (amount: string) => void;
  onPairChange: (pair: CurrencyPair) => void;
  pair: CurrencyPair;
};

export const CurrencyConverter = ({
  amount,
  onAmountChange,
  onPairChange,
  pair,
}: CurrencyConverterProps) => {
  const [loggedEntryId, setLoggedEntryId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const { isFavorite, toggleFavorite } = useFavoritePairs();
  const { addEntry, entries: conversionLogEntries } = useConversionLog();

  const {
    data: ratesData,
    isError: isRateError,
    isPending: isRatePending,
  } = useQuery({
    queryKey: ["getRates", pair.base, pair.quote],
    queryFn: async () => {
      const { data } = await rates.getRates({
        base: pair.base,
        quotes: pair.quote,
      });

      return data;
    },
    enabled: pair.base !== pair.quote,
  });

  const isSameCurrency = pair.base === pair.quote;
  const rate = isSameCurrency ? 1 : (ratesData?.[0]?.rate ?? 0);
  const normalizedInput = Number(amount.replace(",", "."));
  const hasRate =
    isSameCurrency ||
    (!isRatePending && !isRateError && ratesData?.[0]?.rate !== undefined);
  const hasValidConversion =
    amount.length > 0 &&
    Number.isFinite(normalizedInput) &&
    normalizedInput > 0 &&
    hasRate &&
    rate > 0;
  const numericOutput = hasValidConversion ? normalizedInput * rate : 0;
  const outputValue =
    hasValidConversion ? numericOutput.toFixed(2) : "0";
  const isCurrentPairFavorite = isFavorite(pair.base, pair.quote);
  const isLogged =
    loggedEntryId !== null &&
    conversionLogEntries.some((entry) => entry.id === loggedEntryId);

  const resetLoggedState = () => {
    setLoggedEntryId(null);
  };

  const handleInputChange = (value: string) => {
    onAmountChange(value);
    resetLoggedState();
  };

  const handleInputCurrencyChange = (currency: string) => {
    onPairChange({ ...pair, base: currency });
    resetLoggedState();
  };

  const handleOutputCurrencyChange = (currency: string) => {
    onPairChange({ ...pair, quote: currency });
    resetLoggedState();
  };

  const handleSwap = () => {
    onPairChange({ base: pair.quote, quote: pair.base });
    resetLoggedState();
  };

  const handleFavorite = () => {
    const isNowFavorite = toggleFavorite(pair.base, pair.quote);
    const pairLabel = `${pair.base}/${pair.quote}`;

    setAnnouncement(
      isNowFavorite
        ? `${pairLabel} added to favorites.`
        : `${pairLabel} removed from favorites.`,
    );
  };

  const handleLogConversion = () => {
    if (!hasValidConversion || isLogged) {
      return;
    }

    const entry = addEntry({
      base: pair.base,
      inputAmount: normalizedInput,
      outputAmount: numericOutput,
      quote: pair.quote,
      rate,
    });
    setLoggedEntryId(entry.id);
    setAnnouncement(
      `${normalizedInput} ${pair.base} converted to ${outputValue} ${pair.quote} was logged.`,
    );
  };

  return (
    <section aria-labelledby="converter-title">
      <h2
        id="converter-title"
        className="typography-preset-2 mb-200 text-neutral-0"
      >
        CHECK THE RATE
      </h2>

      <div className="h-auto rounded-20 bg-[#171717] md:h-[223px]">
        <div className="grid items-center gap-150 p-200 md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)]">
          <div className="min-w-0 rounded-12 border border-[#2a2a2a] bg-[#1f1f1f] p-200 md:p-250">
            <label
              htmlFor="send-amount"
              className="typography-preset-5-medium mb-150 block text-neutral-200"
            >
              SEND
            </label>

            <div className="flex min-h-600 min-w-0 items-center gap-200">
              <div className="min-w-0 flex-1">
                <input
                  value={amount}
                  onChange={(event) => handleInputChange(event.target.value)}
                  id="send-amount"
                  className={cn(
                    "typography-preset-1-tablet lg:typography-preset-1 field-sizing-content block h-600 min-w-[1ch] max-w-full rounded-6 border border-transparent bg-transparent px-050 text-neutral-0 outline-none placeholder:text-neutral-200 focus-visible:border-brand-lime",
                    amount &&
                      "border-b-[#2a2a2a] hover:border-b-[#666]",
                  )}
                  placeholder="0"
                  inputMode="decimal"
                  aria-label="Amount to send"
                />
              </div>

              <CurrencyPicker
                label="Select send currency"
                value={pair.base}
                onChange={handleInputCurrencyChange}
              />
            </div>
          </div>

          <button
            type="button"
            className="flex size-600 cursor-pointer items-center justify-center justify-self-center rounded-10 border border-[#2a2a2a] bg-[#1f1f1f] text-neutral-0 outline-none transition-colors hover:bg-[#2a2a2a] focus-visible:border-brand-lime md:justify-self-auto"
            aria-label="Swap currencies"
            onClick={handleSwap}
          >
            <img src="/images/icon-exchange.svg" alt="" className="size-200" />
          </button>

          <div className="min-w-0 rounded-12 border border-[#2a2a2a] bg-[#1f1f1f] p-200 md:p-250">
            <span className="typography-preset-5-medium mb-150 block text-neutral-200">
              RECEIVE
            </span>

            <div className="flex min-h-600 min-w-0 items-center gap-200">
              <output
                htmlFor="send-amount"
                aria-live="polite"
                className="typography-preset-1-tablet lg:typography-preset-1 block min-w-0 flex-1 text-brand-lime"
              >
                {outputValue}
              </output>

              <CurrencyPicker
                label="Select receive currency"
                value={pair.quote}
                onChange={handleOutputCurrencyChange}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-[#2a2a2a] px-200 py-200 md:flex md:items-center md:justify-between md:px-250">
          <p className="typography-preset-5 text-neutral-0">
            1 {pair.base} = {rate ? rate.toFixed(4) : "----"} {pair.quote}
          </p>

          <div className="mt-200 grid w-full max-w-[257px] grid-cols-[1fr_1.13fr] gap-100 md:mt-0">
            <button
              type="button"
              className={cn(
                "typography-preset-5-medium flex h-400 w-full cursor-pointer items-center justify-center gap-100 rounded-6 border outline-none transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand-lime",
                isCurrentPairFavorite
                  ? "border-brand-lime bg-brand-lime text-black hover:bg-brand-lime/80"
                  : "border-brand-lime bg-transparent text-neutral-0 hover:bg-brand-lime/15",
              )}
              aria-pressed={isCurrentPairFavorite}
              onClick={handleFavorite}
            >
              <img
                src={
                  isCurrentPairFavorite
                    ? "/images/icon-star-filled.svg"
                    : "/images/icon-star.svg"
                }
                alt=""
                className="size-200"
              />
              {isCurrentPairFavorite ? "FAVORITED" : "FAVORITE"}
            </button>

            <button
              type="button"
              className={cn(
                "typography-preset-5-medium flex h-400 w-full items-center justify-center gap-100 rounded-6 border outline-none transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand-lime",
                isLogged
                  ? "cursor-not-allowed border-brand-lime bg-brand-lime text-black"
                  : hasValidConversion
                    ? "cursor-pointer border-brand-lime text-neutral-0 hover:bg-brand-lime/15"
                    : "cursor-not-allowed border-[#3a3a3a] text-[#666]",
              )}
              disabled={!hasValidConversion || isLogged}
              onClick={handleLogConversion}
            >
              {isLogged && (
                <img src="/images/icon-check.svg" alt="" className="size-150" />
              )}
              {isLogged ? "LOGGED" : "LOG CONVERSION"}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
    </section>
  );
};
