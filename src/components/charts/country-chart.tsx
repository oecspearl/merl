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
} from "recharts";
import type { ChartDataPoint } from "@/lib/chart-utils";
import { collapseToAnnual, aggregateToOECS } from "@/lib/chart-utils";

interface CountryColumnChartProps {
  data: ChartDataPoint[];
  oecs: boolean;
}

export function CountryColumnChart({ data, oecs }: CountryColumnChartProps) {
  let processed = oecs ? aggregateToOECS(data) : data;
  processed = collapseToAnnual(processed);

  // Group by country, sum target + progress
  const grouped: Record<string, { target: number; progress: number }> = {};
  for (const item of processed) {
    const key = item.country;
    grouped[key] ??= { target: 0, progress: 0 };
    grouped[key].target += item.target;
    grouped[key].progress += item.value;
  }

  const chartData = Object.entries(grouped).map(([country, vals]) => ({
    country,
    Target: vals.target,
    Progress: vals.progress,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} barGap={4} barSize={22}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="country" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend verticalAlign="top" align="right" />
        <Bar dataKey="Target" fill="#D6BBFB" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Progress" fill="#7F56D9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
