import {
  type ConversionLogEntry,
  useConversionLog,
} from "@/entities/conversion-log";
import { getAssetUrl } from "@/shared/lib/getAssetUrl";
import { useState } from "react";

const amountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const logDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});

const logDateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatRelativeTime = (createdAt: string, now: number) => {
  const timestamp = Date.parse(createdAt);

  if (!Number.isFinite(timestamp)) {
    return "—";
  }

  const elapsedMilliseconds = Math.max(0, now - timestamp);
  const elapsedMinutes = Math.floor(elapsedMilliseconds / 60_000);

  if (elapsedMinutes < 1) {
    return "NOW";
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}M`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `${elapsedHours}H`;
  }

  return logDateFormatter.format(timestamp);
};

const formatDateTime = (createdAt: string) => {
  const timestamp = Date.parse(createdAt);
  return Number.isFinite(timestamp)
    ? logDateTimeFormatter.format(timestamp)
    : undefined;
};

type ConversionLogRowProps = {
  entry: ConversionLogEntry;
  now: number;
  onRemove: () => void;
};

const ConversionLogRow = ({
  entry,
  now,
  onRemove,
}: ConversionLogRowProps) => (
  <li className="grid min-h-[48px] grid-cols-[36px_minmax(76px,1fr)_auto_40px] items-center gap-050 rounded-8 border border-[#2a2a2a] bg-[#1f1f1f] px-100 transition-colors hover:bg-[#242424] md:grid-cols-[52px_minmax(112px,1fr)_auto_40px] md:gap-150 md:px-150">
    <time
      dateTime={entry.createdAt}
      title={formatDateTime(entry.createdAt)}
      className="typography-preset-6 text-neutral-200"
    >
      {formatRelativeTime(entry.createdAt, now)}
    </time>

    <p className="typography-preset-5 flex min-w-0 items-center gap-075 truncate text-neutral-0">
      <span>{entry.base}</span>
      <img
        src={getAssetUrl("images/icon-arrow-right.svg")}
        alt=""
        width={11}
        height={11}
        className="size-[11px] shrink-0"
      />
      <span>{entry.quote}</span>
    </p>

    <p className="typography-preset-5 flex min-w-0 items-center justify-end gap-100 tabular-nums">
      <span className="truncate text-neutral-200">
        {amountFormatter.format(entry.inputAmount)}
      </span>
      <span className="truncate text-brand-lime">
        {amountFormatter.format(entry.outputAmount)}
      </span>
    </p>

    <button
      type="button"
      onClick={onRemove}
      aria-label={`Delete ${entry.base}/${entry.quote} conversion from log`}
      className="flex size-500 cursor-pointer items-center justify-center rounded-8 outline-none transition-colors hover:bg-white/5 focus-visible:ring-1 focus-visible:ring-brand-lime"
    >
      <img
        src={getAssetUrl("images/icon-delete.svg")}
        alt=""
        width={16}
        height={16}
        className="size-200"
      />
    </button>
  </li>
);

export const ConversionLog = () => {
  const [announcement, setAnnouncement] = useState("");
  const [now] = useState(Date.now);
  const { clearEntries, entries, removeEntry } = useConversionLog();

  const handleRemove = (entry: ConversionLogEntry) => {
    removeEntry(entry.id);
    setAnnouncement(`${entry.base}/${entry.quote} conversion deleted.`);
  };

  const handleClear = () => {
    const entryCount = entries.length;
    clearEntries();
    setAnnouncement(
      `${entryCount} ${entryCount === 1 ? "conversion" : "conversions"} cleared from the log.`,
    );
  };

  if (entries.length === 0) {
    return (
      <div
        className="flex min-h-[320px] flex-col items-center justify-center text-center"
        role="status"
      >
        <p className="typography-preset-2 text-neutral-0">
          No conversions logged yet
        </p>
        <p className="typography-preset-4 mt-200 max-w-[440px] text-neutral-200">
          Log a conversion to keep its pair and amounts here.
        </p>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="conversion-log-title"
      className="rounded-16 bg-[#171717] p-150 md:p-200"
    >
      <header className="mb-150 flex min-h-400 items-center justify-between gap-150">
        <h2
          id="conversion-log-title"
          className="typography-preset-5 text-neutral-0"
        >
          CONVERSION LOG
        </h2>

        <div className="flex shrink-0 items-center gap-100">
          <p className="typography-preset-6 text-neutral-200">
            {entries.length} LOGGED
          </p>
          <button
            type="button"
            onClick={handleClear}
            className="typography-preset-6 h-300 cursor-pointer rounded-6 border border-[#3a3a3a] px-100 text-neutral-0 outline-none transition-colors hover:border-neutral-200 hover:bg-white/5 focus-visible:border-brand-lime"
          >
            CLEAR ALL
          </button>
        </div>
      </header>

      <ul className="flex flex-col gap-100">
        {entries.map((entry) => (
          <ConversionLogRow
            key={entry.id}
            entry={entry}
            now={now}
            onRemove={() => handleRemove(entry)}
          />
        ))}
      </ul>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
};
