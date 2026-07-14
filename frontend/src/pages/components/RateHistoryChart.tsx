import { Rate } from "@/shared/api/generated/data-contracts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import type { RateRange } from "./RateHistoryRangeFilter";

type RateHistoryChartProps = {
  data: Rate[];
  range: RateRange;
};

const formatAxisDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00`));

const getTickCount = (range: RateRange, isCompact: boolean) => {
  if (range === "1D") return 2;
  if (range === "1W") return isCompact ? 3 : 7;
  return isCompact ? 3 : 6;
};

const getXAxisTicks = (
  data: Rate[],
  range: RateRange,
  isCompact: boolean,
) => {
  const tickCount = getTickCount(range, isCompact);

  if (data.length <= tickCount) {
    return data.map((item) => item.date);
  }

  const lastIndex = data.length - 1;
  const ticks = Array.from({ length: tickCount }, (_, index) => {
    const dataIndex = Math.round((index * lastIndex) / (tickCount - 1));
    return data[dataIndex].date;
  });

  return [...new Set(ticks)];
};

export const RateHistoryChart: React.FC<RateHistoryChartProps> = ({
  data,
  range,
}) => {
  const [chartWidth, setChartWidth] = useState(0);
  const chartData = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const latestRate = chartData[chartData.length - 1];
  const isCompact = chartWidth > 0 && chartWidth < 480;
  const xTicks = getXAxisTicks(chartData, range, isCompact);
  const pairLabel = latestRate ? `${latestRate.base}/${latestRate.quote}` : "";
  const latestLabel = latestRate
    ? `${latestRate.rate.toFixed(4)} · ${new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
      })
        .format(new Date(`${latestRate.date}T00:00:00`))
        .toUpperCase()}`
    : "";

  return (
    <div
      className="mt-200 rounded-16 bg-[#171717] p-200 md:rounded-20 md:p-250"
      aria-label={`${pairLabel} rate history chart`}
    >
      <div className="mb-200 flex items-center justify-between gap-200">
        <h3 className="typography-preset-4 text-neutral-0">{pairLabel}</h3>
        <p className="typography-preset-5 whitespace-nowrap text-right text-neutral-200">
          {latestLabel}
        </p>
      </div>

      <div className="h-[320px] md:h-[377px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          onResize={(width) => setChartWidth(width)}
        >
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient
                id="rate-history-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#cef739" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#cef739" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#2a2a2a"
              strokeDasharray="2 6"
            />
            <YAxis
              domain={["dataMin - 0.001", "dataMax + 0.001"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9d9d9d", fontSize: 10 }}
              tickFormatter={(value) => Number(value).toFixed(4)}
              width={isCompact ? 48 : 64}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9d9d9d", fontSize: 10 }}
              ticks={xTicks}
              tickFormatter={formatAxisDate}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#cef739"
              strokeWidth={2}
              fill="url(#rate-history-gradient)"
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
