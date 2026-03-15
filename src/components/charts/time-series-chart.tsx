"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "@/lib/chart-utils";
import {
  buildTimeSeriesData,
  aggregateToOECS,
  titleize,
} from "@/lib/chart-utils";
import { TRAININGS, GENDERS, EDROLES } from "@/types/constants";

const LINE_COLORS = [
  "#7F56D9",
  "#FF5CA8",
  "#4753FF",
  "#FFA500",
  "#00BFFF",
  "#90EE90",
  "#D6BBFB",
  "#FF6B6B",
  "#48BB78",
  "#ED64A6",
  "#667EEA",
  "#F6AD55",
];

interface TimeSeriesChartProps {
  data: ChartDataPoint[];
  oecs: boolean;
  groupKey:
    | "country"
    | "training-gender"
    | "country-training"
    | "gender-role"
    | "country-role";
  showTrainingFilter?: boolean;
  showGenderFilter?: boolean;
  showRoleFilter?: boolean;
  title?: string;
}

export function TimeSeriesChart({
  data,
  oecs,
  groupKey,
  showTrainingFilter = false,
  showGenderFilter = false,
  showRoleFilter = false,
  title,
}: TimeSeriesChartProps) {
  const [training, setTraining] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");

  const processed = oecs ? aggregateToOECS(data) : data;

  const { chartData, lineKeys } = buildTimeSeriesData(
    processed,
    groupKey,
    training || undefined,
    gender || undefined,
    role || undefined
  );

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No time series data available
      </div>
    );
  }

  const genderOptions = GENDERS.map((g) => titleize(g));
  const edrolesOptions = EDROLES.map((r) => titleize(r));

  return (
    <div>
      {title && (
        <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          {title}
        </h5>
      )}
      <div className="flex gap-3 mb-3">
        {showTrainingFilter && (
          <select
            value={training}
            onChange={(e) => setTraining(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
          >
            <option value="">All Training Types</option>
            {TRAININGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
        {showGenderFilter && (
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
          >
            <option value="">All</option>
            {genderOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        )}
        {showRoleFilter && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
          >
            <option value="">All Roles</option>
            {edrolesOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        )}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend verticalAlign="top" align="right" />
          {lineKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={LINE_COLORS[i % LINE_COLORS.length]}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
