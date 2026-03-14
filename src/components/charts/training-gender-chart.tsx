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
import { TRAININGS, GENDERS } from "@/types/constants";

interface TrainingGenderColumnChartProps {
  data: ChartDataPoint[];
  oecs: boolean;
}

export function TrainingGenderColumnChart({
  data,
  oecs,
}: TrainingGenderColumnChartProps) {
  const [trainingFilter, setTrainingFilter] = useState("");
  const [orientation, setOrientation] = useState<
    "training-per-gender" | "gender-per-training"
  >("training-per-gender");

  let processed = oecs ? aggregateToOECS(data) : data;

  // Parse key: "ECE.Male" -> { training: "ECE", gender: "Male" }
  const enriched = processed.map((item) => {
    const [training, gender] = item.key?.split(".") ?? [];
    return { ...item, training, gender };
  });

  // Apply training filter
  const filtered = enriched.filter(
    (item) =>
      !!item.training &&
      (!trainingFilter || item.training === trainingFilter)
  );

  const collapsed = collapseToAnnual(filtered);

  // Group by training and gender
  const grouped: Record<
    string,
    { training: string; gender: string; target: number; progress: number }
  > = {};
  for (const item of collapsed) {
    const [training, gender] = item.key?.split(".") ?? [];
    if (!training || !gender) continue;
    const gk = `${training}-${gender}`;
    grouped[gk] ??= { training, gender, target: 0, progress: 0 };
    grouped[gk].target += item.target;
    grouped[gk].progress += item.value;
  }

  const groupedData = Object.values(grouped);
  const trainings = [...new Set(groupedData.map((d) => d.training))];

  let chartData: Record<string, unknown>[];

  if (orientation === "gender-per-training") {
    // Categories: trainings repeated for male then female
    chartData = trainings.flatMap((training) => {
      const male = groupedData.find(
        (d) => d.training === training && d.gender === "Male"
      );
      const female = groupedData.find(
        (d) => d.training === training && d.gender === "Female"
      );
      return [
        {
          category: `${training} (M)`,
          "Male Target": male?.target ?? 0,
          "Male Progress": male?.progress ?? 0,
        },
        {
          category: `${training} (F)`,
          "Female Target": female?.target ?? 0,
          "Female Progress": female?.progress ?? 0,
        },
      ];
    });
  } else {
    // Sort by training: each training shows Male/Female bars
    chartData = trainings.map((training) => {
      const male = groupedData.find(
        (d) => d.training === training && d.gender === "Male"
      );
      const female = groupedData.find(
        (d) => d.training === training && d.gender === "Female"
      );
      return {
        category: training,
        "Male Target": male?.target ?? 0,
        "Male Progress": male?.progress ?? 0,
        "Female Target": female?.target ?? 0,
        "Female Progress": female?.progress ?? 0,
      };
    });
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-3 mb-3">
        <select
          value={trainingFilter}
          onChange={(e) => setTrainingFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
        >
          <option value="">All Training Types</option>
          {TRAININGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={orientation}
          onChange={(e) =>
            setOrientation(
              e.target.value as "training-per-gender" | "gender-per-training"
            )
          }
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
        >
          <option value="training-per-gender">Sort By Training</option>
          <option value="gender-per-training">Sort By Gender</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} barGap={2} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend verticalAlign="top" align="right" />
          <Bar dataKey="Male Target" fill="#98AFFF" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Male Progress" fill="#4753FF" radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="Female Target"
            fill="#FDD1E7"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Female Progress"
            fill="#FF5CA8"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
