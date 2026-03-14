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
import { SUBJECTS } from "@/types/constants";

interface SubjectColumnChartProps {
  data: ChartDataPoint[];
  oecs: boolean;
}

const SUBJECT_COLORS = [
  "#98AFFF",
  "#4753FF",
  "#FDD1E7",
  "#FF5CA8",
  "#FFA500",
  "#00BFFF",
  "#90EE90",
];

export function SubjectColumnChart({ data, oecs }: SubjectColumnChartProps) {
  const [subjectFilter, setSubjectFilter] = useState("");

  let processed = oecs ? aggregateToOECS(data) : data;

  const filtered = processed.filter(
    (item) =>
      !!item.key && (!subjectFilter || item.key === subjectFilter)
  );

  const collapsed = collapseToAnnual(filtered);

  // Group by country and subject
  const grouped: Record<
    string,
    Record<string, { target: number; progress: number }>
  > = {};
  for (const item of collapsed) {
    const subject = item.key ?? "";
    grouped[item.country] ??= {};
    grouped[item.country][subject] ??= { target: 0, progress: 0 };
    grouped[item.country][subject].target += item.target;
    grouped[item.country][subject].progress += item.value;
  }

  const countries = Object.keys(grouped).sort();
  const subjects = [
    ...new Set(collapsed.map((d) => d.key ?? "").filter(Boolean)),
  ];

  // Build chart data per subject section
  const chartData = subjects.flatMap((subject) =>
    countries.map((country) => ({
      category: `${country}`,
      [`${subject} Target`]: grouped[country]?.[subject]?.target ?? 0,
      [`${subject} Progress`]: grouped[country]?.[subject]?.progress ?? 0,
      section: subject,
    }))
  );

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No data available
      </div>
    );
  }

  const subjectOptions = SUBJECTS.map((s) => titleize(s));

  return (
    <div>
      <div className="flex gap-3 mb-3">
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
        >
          <option value="">All Subject Types</option>
          {subjectOptions.map((s) => (
            <option key={s} value={s}>
              {s}
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
          {subjects.map((subject, i) => (
            <Bar
              key={`${subject}-target`}
              dataKey={`${subject} Target`}
              fill="#cccccc"
              radius={[4, 4, 0, 0]}
            />
          ))}
          {subjects.map((subject, i) => (
            <Bar
              key={`${subject}-progress`}
              dataKey={`${subject} Progress`}
              fill={SUBJECT_COLORS[i % SUBJECT_COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
