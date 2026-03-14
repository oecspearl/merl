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
import { EDROLES } from "@/types/constants";

interface GenderRoleColumnChartProps {
  data: ChartDataPoint[];
  oecs: boolean;
}

export function GenderRoleColumnChart({
  data,
  oecs,
}: GenderRoleColumnChartProps) {
  const [roleFilter, setRoleFilter] = useState("");
  const [orientation, setOrientation] = useState<
    "role-per-gender" | "gender-per-role"
  >("role-per-gender");

  let processed = oecs ? aggregateToOECS(data) : data;

  // Parse key: "Male.Ed Officers" -> { gender: "Male", role: "Ed Officers" }
  const enriched = processed.map((item) => {
    const [gender, role] = item.key?.split(".") ?? [];
    return { ...item, gender, role };
  });

  const filtered = enriched.filter(
    (item) =>
      !!item.role && (!roleFilter || item.role === roleFilter)
  );

  const collapsed = collapseToAnnual(filtered);

  // Group by role and gender
  const grouped: Record<
    string,
    { role: string; gender: string; target: number; progress: number }
  > = {};
  for (const item of collapsed) {
    const [gender, role] = item.key?.split(".") ?? [];
    if (!gender || !role) continue;
    const gk = `${role}-${gender}`;
    grouped[gk] ??= { role, gender, target: 0, progress: 0 };
    grouped[gk].target += item.target;
    grouped[gk].progress += item.value;
  }

  const groupedData = Object.values(grouped);
  const roles = [...new Set(groupedData.map((d) => d.role))];

  let chartData: Record<string, unknown>[];

  if (orientation === "gender-per-role") {
    chartData = roles.flatMap((role) => {
      const male = groupedData.find(
        (d) => d.role === role && d.gender === "Male"
      );
      const female = groupedData.find(
        (d) => d.role === role && d.gender === "Female"
      );
      return [
        {
          category: `${role} (M)`,
          "Male Target": male?.target ?? 0,
          "Male Progress": male?.progress ?? 0,
        },
        {
          category: `${role} (F)`,
          "Female Target": female?.target ?? 0,
          "Female Progress": female?.progress ?? 0,
        },
      ];
    });
  } else {
    chartData = roles.map((role) => {
      const male = groupedData.find(
        (d) => d.role === role && d.gender === "Male"
      );
      const female = groupedData.find(
        (d) => d.role === role && d.gender === "Female"
      );
      return {
        category: role,
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

  const edrolesOptions = EDROLES.map((r) => titleize(r));

  return (
    <div>
      <div className="flex gap-3 mb-3">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
        >
          <option value="">All Roles</option>
          {edrolesOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={orientation}
          onChange={(e) =>
            setOrientation(
              e.target.value as "role-per-gender" | "gender-per-role"
            )
          }
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
        >
          <option value="role-per-gender">Sort By Ed Roles</option>
          <option value="gender-per-role">Sort By Gender</option>
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
