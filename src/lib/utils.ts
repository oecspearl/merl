import { QuestionCategory } from "@/types/database";

// Maps for converting integer DB values to string enum values
const CATEGORY_VALUES: QuestionCategory[] = [
  "no_level",
  "country",
  "country_training_gender",
  "country_subject",
  "country_gender",
  "country_post",
  "country_gender_edrole",
];

const INPUT_TYPE_VALUES = ["number", "boolean"] as const;
const REPORTING_PERIOD_VALUES = ["yearly", "quarterly"] as const;
const FISCAL_YEAR_VALUES = ["july_to_june", "october_to_september"] as const;
const STATUS_VALUES = ["draft", "submitted"] as const;

function mapInt<T>(value: unknown, mapping: readonly T[], fallback: T): T {
  if (typeof value === "string" && (mapping as readonly unknown[]).includes(value)) return value as T;
  if (typeof value === "number" && value >= 0 && value < mapping.length) return mapping[value];
  return fallback;
}

/**
 * Convert integer enum fields from the database to their string equivalents.
 * Handles projects, questions, baselines, targets, and project_responses.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeProject(raw: any): any {
  const project = {
    ...raw,
    reporting_period: mapInt(raw.reporting_period, REPORTING_PERIOD_VALUES, "yearly"),
    fiscal_year: mapInt(raw.fiscal_year, FISCAL_YEAR_VALUES, "july_to_june"),
  };

  if (project.components) {
    project.components = project.components.map(normalizeComponent);
  }
  if (project.project_responses) {
    project.project_responses = project.project_responses.map(normalizeProjectResponse);
  }
  return project;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeComponent(comp: any): any {
  return {
    ...comp,
    questions: (comp.questions ?? []).map(normalizeQuestion),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeQuestion(q: any): any {
  return {
    ...q,
    category: mapInt(q.category, CATEGORY_VALUES, "no_level"),
    input_type: mapInt(q.input_type, INPUT_TYPE_VALUES, "number"),
    baselines: (q.baselines ?? []).map(normalizeStatus),
    targets: (q.targets ?? []).map(normalizeStatus),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeStatus(record: any): any {
  return {
    ...record,
    status: mapInt(record.status, STATUS_VALUES, "draft"),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProjectResponse(pr: any): any {
  return {
    ...pr,
    status: mapInt(pr.status, STATUS_VALUES, "draft"),
  };
}

/**
 * Convert question category to data point column headers.
 * Mirrors Rails Question#data_points method.
 * e.g., "country_gender" → ["Country", "Gender"]
 */
export function getDataPoints(category: QuestionCategory | null): string[] {
  if (!category || category === "no_level") return [];
  return category.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1));
}

/**
 * Get project years array from start_date to end_date.
 * Mirrors Rails Project#years method.
 */
export function getProjectYears(startDate: string | null, endDate: string | null): number[] {
  if (!startDate || !endDate) return [];
  const start = new Date(startDate).getFullYear();
  const end = new Date(endDate).getFullYear();
  const years: number[] = [];
  for (let y = start; y <= end; y++) {
    years.push(y);
  }
  return years;
}

/**
 * Get current fiscal quarter based on fiscal year type.
 * Mirrors Rails Project#current_quarter method.
 */
export function getCurrentQuarter(fiscalYear: "july_to_june" | "october_to_september"): number {
  const month = new Date().getMonth() + 1; // 1-12
  if (fiscalYear === "july_to_june") {
    if (month >= 7 && month <= 9) return 1;
    if (month >= 10 && month <= 12) return 2;
    if (month >= 1 && month <= 3) return 3;
    return 4;
  }
  // october_to_september
  if (month >= 10 && month <= 12) return 1;
  if (month >= 1 && month <= 3) return 2;
  if (month >= 4 && month <= 6) return 3;
  return 4;
}

/**
 * Format currency value.
 */
export function formatCurrency(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Format date string to DD-MM-YYYY.
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Extract username from email (before @, titleized).
 * Mirrors Rails Note#username method.
 */
export function getUsernameFromEmail(email: string): string {
  const prefix = email.split("@")[0];
  return prefix
    .split(/[._-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Titleize an enum value.
 * e.g., "july_to_june" → "July To June"
 */
export function titleize(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Combine Tailwind classes conditionally.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
