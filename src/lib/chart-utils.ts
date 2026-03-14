import type { Project, Question } from "@/types/database";

export interface ChartDataPoint {
  year: number;
  quarter: number | null;
  country: string;
  countryId: string | null;
  key: string | null;
  baseline: number;
  target: number;
  value: number;
}

/**
 * Build performance data for a question, mirroring Rails question_performance_indicators.
 * Only uses submitted baselines, targets, and project responses.
 */
export function buildPerformanceData(
  project: Project,
  question: Question
): ChartDataPoint[] {
  const results: ChartDataPoint[] = [];

  // Baseline lookup: countryId -> key -> value
  const baselines: Record<string, Record<string, number>> = {};
  for (const b of question.baselines ?? []) {
    if (b.status !== "submitted") continue;
    const cid = b.country_id ?? "";
    baselines[cid] ??= {};
    baselines[cid][b.key ?? ""] = parseFloat(b.value ?? "0") || 0;
  }

  // Target lookup: countryId -> year -> key -> value
  const targets: Record<string, Record<number, Record<string, number>>> = {};
  for (const t of question.targets ?? []) {
    if (t.status !== "submitted") continue;
    const cid = t.country_id ?? "";
    const yr = parseInt(t.year) || 0;
    targets[cid] ??= {};
    targets[cid][yr] ??= {};
    targets[cid][yr][t.key ?? ""] = parseFloat(t.value ?? "0") || 0;
  }

  // Country name map
  const countryNames: Record<string, string> = {};
  for (const c of project.countries ?? []) {
    countryNames[c.id] = c.name;
  }

  for (const pr of project.project_responses ?? []) {
    if (pr.status !== "submitted") continue;
    for (const pi of pr.performance_indicators ?? []) {
      if (pi.question_id !== question.id) continue;
      const cid = pi.country_id ?? "";
      const key = pi.key ?? "";
      results.push({
        year: pr.year,
        quarter: pr.quarter,
        country: pi.country_id
          ? (countryNames[pi.country_id] ?? "Unknown")
          : "OECS",
        countryId: pi.country_id,
        key: pi.key,
        baseline: baselines[cid]?.[key] ?? 0,
        target: targets[cid]?.[pr.year]?.[key] ?? 0,
        value: parseFloat(pi.value ?? "0") || 0,
      });
    }
  }
  return results;
}

/**
 * Collapse quarterly data to annual totals per country/key.
 */
export function collapseToAnnual(data: ChartDataPoint[]): ChartDataPoint[] {
  const grouped: Record<string, ChartDataPoint> = {};
  for (const item of data) {
    const gk = `${item.year}-${item.country}-${item.key ?? ""}`;
    if (!grouped[gk]) {
      grouped[gk] = { ...item, quarter: null };
    } else {
      grouped[gk].value += item.value;
    }
  }
  return Object.values(grouped);
}

/**
 * Filter data by selected years, quarters, and country names.
 */
export function filterBySelections(
  data: ChartDataPoint[],
  years: number[],
  quarters: number[],
  countryNames: string[]
): ChartDataPoint[] {
  return data.filter((item) => {
    const yearOk = !years.length || years.includes(item.year);
    const quarterOk =
      !quarters.length ||
      item.quarter === null ||
      quarters.includes(item.quarter);
    const countryOk =
      !countryNames.length || countryNames.includes(item.country);
    return yearOk && quarterOk && countryOk;
  });
}

/**
 * Aggregate all countries into a single OECS entry.
 */
export function aggregateToOECS(data: ChartDataPoint[]): ChartDataPoint[] {
  const grouped: Record<string, ChartDataPoint> = {};
  for (const item of data) {
    const gk = `${item.year}-${item.quarter}-${item.key ?? ""}`;
    if (!grouped[gk]) {
      grouped[gk] = { ...item, country: "OECS", countryId: null };
    } else {
      grouped[gk].value += item.value;
      grouped[gk].target += item.target;
      grouped[gk].baseline += item.baseline;
    }
  }
  return Object.values(grouped);
}

/**
 * Build time series data for Recharts LineChart.
 * Groups data by period label, with each group becoming a line series.
 */
export function buildTimeSeriesData(
  data: ChartDataPoint[],
  groupKey:
    | "country"
    | "training-gender"
    | "country-training"
    | "gender-role"
    | "country-role",
  filterTraining?: string,
  filterGender?: string,
  filterRole?: string
): { chartData: Record<string, unknown>[]; lineKeys: string[] } {
  // Enrich data with parsed key fields
  const enriched = data.map((item) => {
    if (
      groupKey === "gender-role" ||
      groupKey === "country-role"
    ) {
      const [gender, role] = item.key?.split(".") ?? [];
      return { ...item, gender, role };
    } else if (
      groupKey === "training-gender" ||
      groupKey === "country-training"
    ) {
      const [training, gender] = item.key?.split(".") ?? [];
      return { ...item, training, gender };
    }
    return item;
  });

  // Apply dropdown filters
  type EnrichedPoint = ChartDataPoint & {
    training?: string;
    gender?: string;
    role?: string;
  };

  const filtered = (enriched as EnrichedPoint[]).filter((item) => {
    if (filterTraining && item.training !== filterTraining) return false;
    if (filterGender && item.gender !== filterGender) return false;
    if (filterRole && item.role !== filterRole) return false;
    // For role/training group keys, exclude items without parsed fields
    if (
      (groupKey === "gender-role" || groupKey === "country-role") &&
      !item.role
    )
      return false;
    if (
      (groupKey === "training-gender" || groupKey === "country-training") &&
      !item.training
    )
      return false;
    return true;
  });

  // Group by series key -> period -> sum
  const getSeriesKey = (item: EnrichedPoint): string => {
    switch (groupKey) {
      case "gender-role":
        return `${item.gender} - ${item.role}`;
      case "training-gender":
        return `${item.training} - ${item.gender}`;
      case "country-role":
        return `${item.country} - ${item.role}`;
      case "country-training":
        return `${item.country} - ${item.training}`;
      default:
        return item.country;
    }
  };

  const grouped: Record<string, Record<string, number>> = {};
  const periods = new Set<string>();

  for (const item of filtered) {
    const period =
      item.quarter != null
        ? `Q${item.quarter} ${item.year}`
        : `${item.year}`;
    const seriesKey = getSeriesKey(item);
    grouped[seriesKey] ??= {};
    grouped[seriesKey][period] =
      (grouped[seriesKey][period] ?? 0) + item.value;
    periods.add(period);
  }

  // Sort periods chronologically
  const sortedPeriods = Array.from(periods).sort((a, b) => {
    const parseP = (p: string) => {
      const parts = p.split(" ");
      if (parts.length === 2) {
        return {
          year: parseInt(parts[1]),
          quarter: parseInt(parts[0].slice(1)),
        };
      }
      return { year: parseInt(parts[0]), quarter: 0 };
    };
    const pa = parseP(a);
    const pb = parseP(b);
    return pa.year - pb.year || pa.quarter - pb.quarter;
  });

  const lineKeys = Object.keys(grouped).sort();

  // Build Recharts data format
  const chartData = sortedPeriods.map((period) => {
    const point: Record<string, unknown> = { period };
    for (const key of lineKeys) {
      point[key] = grouped[key]?.[period] ?? null;
    }
    return point;
  });

  return { chartData, lineKeys };
}

export function titleize(str: string): string {
  return str
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
