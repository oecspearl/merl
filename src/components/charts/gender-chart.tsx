"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";
import type { ChartDataPoint } from "@/lib/chart-utils";
import { collapseToAnnual, aggregateToOECS } from "@/lib/chart-utils";

interface GenderColumnChartProps {
  data: ChartDataPoint[];
  oecs: boolean;
}

export function GenderColumnChart({ data, oecs }: GenderColumnChartProps) {
  let processed = oecs ? aggregateToOECS(data) : data;
  processed = collapseToAnnual(processed);

  // Group by country and gender (key = "Male" or "Female")
  const grouped: Record<
    string,
    Record<string, { target: number; progress: number }>
  > = {};
  for (const item of processed) {
    const gender = item.key ?? "Unknown";
    grouped[item.country] ??= {};
    grouped[item.country][gender] ??= { target: 0, progress: 0 };
    grouped[item.country][gender].target += item.target;
    grouped[item.country][gender].progress += item.value;
  }

  const countries = Object.keys(grouped).sort();

  // Build chart data: Male section then Female section
  const maleData = countries.map((country) => ({
    country,
    "Male Target": grouped[country]?.["Male"]?.target ?? 0,
    "Male Progress": grouped[country]?.["Male"]?.progress ?? 0,
  }));

  const femaleData = countries.map((country) => ({
    country,
    "Female Target": grouped[country]?.["Female"]?.target ?? 0,
    "Female Progress": grouped[country]?.["Female"]?.progress ?? 0,
  }));

  const chartData = [
    ...maleData.map((d) => ({ ...d, section: "male" })),
    ...femaleData.map((d) => ({
      country: d.country,
      "Female Target": d["Female Target"],
      "Female Progress": d["Female Progress"],
      section: "female",
    })),
  ];

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No data available
      </div>
    );
  }

  const midPoint = maleData.length - 0.5;

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={chartData} barGap={2} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="country" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend verticalAlign="top" align="right" />
        <ReferenceLine x={undefined} stroke="transparent">
          <Label value="" />
        </ReferenceLine>
        {midPoint > 0 && (
          <ReferenceLine
            x={chartData[maleData.length]?.country}
            stroke="#e5e7eb"
            strokeDasharray="3 3"
          />
        )}
        <Bar dataKey="Male Target" fill="#98AFFF" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Male Progress" fill="#4753FF" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Female Target" fill="#FDD1E7" radius={[4, 4, 0, 0]} />
        <Bar
          dataKey="Female Progress"
          fill="#FF5CA8"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
