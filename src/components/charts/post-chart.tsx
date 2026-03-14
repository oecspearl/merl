"use client";

import { useState } from "react";
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
import { collapseToAnnual, aggregateToOECS, titleize } from "@/lib/chart-utils";
import { POSTS } from "@/types/constants";

interface PostColumnChartProps {
  data: ChartDataPoint[];
  oecs: boolean;
}

const POST_COLORS: Record<string, string> = {
  Principal: "#4753FF",
  "Deputy Principal": "#FF5CA8",
};

export function PostColumnChart({ data, oecs }: PostColumnChartProps) {
  const [postFilter, setPostFilter] = useState("");

  let processed = oecs ? aggregateToOECS(data) : data;

  // Parse key (e.g., "Principal" or "Deputy Principal")
  const filtered = processed.filter(
    (item) => !!item.key && (!postFilter || item.key === postFilter)
  );

  const collapsed = collapseToAnnual(filtered);

  // Group by country and post
  const grouped: Record<
    string,
    Record<string, { target: number; progress: number }>
  > = {};
  for (const item of collapsed) {
    const post = item.key ?? "";
    grouped[item.country] ??= {};
    grouped[item.country][post] ??= { target: 0, progress: 0 };
    grouped[item.country][post].target += item.target;
    grouped[item.country][post].progress += item.value;
  }

  const countries = Object.keys(grouped).sort();
  const posts = [...new Set(collapsed.map((d) => d.key ?? ""))].filter(Boolean);

  // Build chart data per post section
  const chartData = posts.flatMap((post) =>
    countries.map((country) => ({
      category: `${country}`,
      [`${post} Target`]: grouped[country]?.[post]?.target ?? 0,
      [`${post} Progress`]: grouped[country]?.[post]?.progress ?? 0,
      section: post,
    }))
  );

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No data available
      </div>
    );
  }

  const postOptions = POSTS.map((p) => titleize(p));

  return (
    <div>
      <div className="flex gap-3 mb-3">
        <select
          value={postFilter}
          onChange={(e) => setPostFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
        >
          <option value="">All Post Types</option>
          {postOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} barGap={2} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend verticalAlign="top" align="right" />
          {posts.map((post) => (
            <Bar
              key={`${post}-target`}
              dataKey={`${post} Target`}
              fill="#cccccc"
              radius={[4, 4, 0, 0]}
            />
          ))}
          {posts.map((post) => (
            <Bar
              key={`${post}-progress`}
              dataKey={`${post} Progress`}
              fill={POST_COLORS[post] ?? "#999"}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
