import { useCurrencies } from "@/features/currency-picker";

export const Headline = () => {
  const { data, isError, isPending } = useCurrencies();
  const currencyCount = data
    ? data.popular.length + data.other.length
    : null;
  const currencyCountLabel = isPending
    ? "-- CURRENCIES"
    : isError
      ? "N/A CURRENCIES"
      : `${currencyCount} CURRENCIES`;
  const accessibleStatus = isPending
    ? "Loading currency count."
    : isError
      ? "Currency count unavailable. End-of-day European Central Bank data."
      : `${currencyCount} currencies. End-of-day European Central Bank data.`;

  return (
    <header className="flex h-800 items-center justify-between px-200 md:px-300">
      <img
        src="/images/logo.svg"
        alt="FX Checker"
        width={139}
        height={26}
      />

      <div className="typography-preset-4 whitespace-nowrap text-right text-neutral-200">
        <p
          aria-hidden="true"
          className="min-w-[14ch] tabular-nums md:min-w-[31ch]"
        >
          {currencyCountLabel}
          <span className="hidden md:inline"> · EOD · ECB DATA</span>
        </p>
        <p className="sr-only" aria-live="polite">
          {accessibleStatus}
        </p>
      </div>
    </header>
  );
};
