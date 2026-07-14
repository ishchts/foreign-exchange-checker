import { cn } from "@/shared/lib/cn";

export type RateRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

type RateHistoryRangeFilterProps = {
  value: RateRange;
  onChange: (value: RateRange) => void;
  className?: string;
};

type Item = {
    label: RateRange
}

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
  onChange
}) => {
  return (
    <div
      className={cn(
        "bg-neutral-700 h-[42px] flex typography-preset-5 text-neutral-200 rounded-8",
        className,
      )}
    >
      {items.map((el) => (
        <button
          key={el.label}
          type="button"
          className={cn("w-[47px] cursor-pointer rounded-8 outline-none transition-colors hover:bg-neutral-600 focus-visible:ring-1 focus-visible:ring-brand-lime", {
            ["text-white bg-neutral-500"]: value === el.label,
          })}
          onClick={() => onChange(el.label)}
        >
          {el.label}
        </button>
      ))}
    </div>
  );
};
