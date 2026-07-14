import { cn } from "@/shared/lib/cn";

export type RateRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

type RateHistoryRangeFilterProps = {
  value: RateRange;
  onChange: (value: RateRange) => void;
  className?: string;
};

type Item = {
  label: RateRange;
};

const items: Item[] = [
  { label: "1D" },
  { label: "1W" },
  { label: "1M" },
  { label: "3M" },
  { label: "1Y" },
  { label: "5Y" },
];

export const RateHistoryRangeFilter: React.FC<RateHistoryRangeFilterProps> = ({
  className,
  value,
  onChange,
}) => {
  return (
    <div
      className={cn(
        "typography-preset-5 grid h-[42px] w-full grid-cols-6 rounded-8 bg-neutral-700 text-neutral-200 md:flex md:w-fit",
        className,
      )}
    >
      {items.map((el) => (
        <button
          key={el.label}
          type="button"
          className={cn(
            "min-w-0 cursor-pointer rounded-8 outline-none transition-colors hover:bg-neutral-600 focus-visible:ring-1 focus-visible:ring-brand-lime md:w-[47px]",
            {
              "bg-neutral-500 text-white": value === el.label,
            },
          )}
          onClick={() => onChange(el.label)}
        >
          {el.label}
        </button>
      ))}
    </div>
  );
};
