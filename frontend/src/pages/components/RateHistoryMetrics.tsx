import { Rate } from "@/shared/api/generated/data-contracts";
import { cn } from "@/shared/lib/cn";
import { Triangle } from "lucide-react";

type RateHistoryMetricsProps = {
  rate: Rate[];
};

type RateMetricCardProps = {
  title: string;
  value: string;
  tone?: "default" | "positive" | "negative";
  showTrendIcon?: boolean;
};
const RateMetricCard: React.FC<RateMetricCardProps> = ({
  title,
  value,
  tone = "default",
  showTrendIcon = false,
}) => {
  return (
    <div
      aria-label="Rate Metric"
      className="min-w-[128px] rounded-16 border border-[#2a2a2a] bg-[#171717] px-250 py-200"
    >
      <div className="typography-preset-5 mb-150 text-neutral-200">
        {title}
      </div>
      <div
        className={cn("typography-preset-2 flex items-center gap-100", {
          ["text-brand-lime"]: tone === "positive",
          ["text-red-500"]: tone === "negative",
        })}
      >
        {showTrendIcon && (
          <Triangle
            aria-hidden="true"
            className={cn("size-3 fill-current", {
              "rotate-180": tone === "negative",
            })}
          />
        )}
        {value}
      </div>
    </div>
  );
};

export const RateHistoryMetrics: React.FC<RateHistoryMetricsProps> = ({
  rate,
}) => {
  const firstPoint = rate[0];
  const lastPoint = rate[rate.length - 1];

  const open = firstPoint.rate;
  const last = lastPoint.rate;
  const change = last - open;
  const percentChange = (change / open) * 100;

  return (
    <div className="flex max-w-[630px] gap-[16px]">
      <RateMetricCard title={"OPEN"} value={open.toString()} />
      <RateMetricCard title={"LAST"} value={last.toString()} />
      <RateMetricCard
        title={"CHANGE"}
        value={`${change >= 0 ? "+" : ""}${change.toFixed(4)}`}
        tone={change >= 0 ? "positive" : "negative"}
      />
      <RateMetricCard
        title={"% CHANGE"}
        value={`${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(2)}%`}
        tone={percentChange >= 0 ? "positive" : "negative"}
        showTrendIcon
      />
    </div>
  );
};
