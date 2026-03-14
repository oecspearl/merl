// Database types matching the Rails PostgreSQL schema (UUID primary keys)

export type UserType = "User" | "SuperAdmin";

export interface User {
  id: string;
  email: string;
  type: UserType;
  created_at: string;
  updated_at: string;
}

export type ReportingPeriod = "yearly" | "quarterly";
export type FiscalYear = "july_to_june" | "october_to_september";

export interface Project {
  id: string;
  name: string;
  donor: string | null;
  budget: number | null;
  approval_date: string | null;
  start_date: string | null;
  end_date: string | null;
  reporting_period: ReportingPeriod;
  fiscal_year: FiscalYear;
  created_by_id: string | null;
  updated_by_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  countries?: Country[];
  components?: Component[];
  project_responses?: ProjectResponse[];
  notes?: Note[];
}

export interface Component {
  id: string;
  title: string;
  objective: string | null;
  outcomes: string | null;
  output: string | null;
  project_id: string;
  created_at: string;
  updated_at: string;
  // Joined data
  questions?: Question[];
}

export type QuestionCategory =
  | "no_level"
  | "country"
  | "country_training_gender"
  | "country_subject"
  | "country_gender"
  | "country_post"
  | "country_gender_edrole";

export const CATEGORY_MAP: Record<QuestionCategory, number> = {
  no_level: 0,
  country: 1,
  country_training_gender: 2,
  country_subject: 3,
  country_gender: 4,
  country_post: 5,
  country_gender_edrole: 6,
};

export type InputType = "number" | "boolean";

export interface Question {
  id: string;
  statement: string | null;
  category: QuestionCategory;
  component_id: string;
  input_type: InputType;
  percentage: boolean;
  region: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  baselines?: Baseline[];
  targets?: Target[];
  performance_indicators?: PerformanceIndicator[];
  locks?: Lock[];
}

export type Status = "draft" | "submitted";

export interface Baseline {
  id: string;
  question_id: string;
  country_id: string | null;
  key: string | null;
  value: string | null;
  status: Status;
  created_by_id: string | null;
  updated_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Target {
  id: string;
  question_id: string;
  country_id: string | null;
  year: string;
  value: string | null;
  key: string | null;
  status: Status;
  created_by_id: string | null;
  updated_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PerformanceIndicator {
  id: string;
  project_response_id: string;
  question_id: string;
  country_id: string | null;
  key: string | null;
  value: string | null;
  means_of_verification: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectResponse {
  id: string;
  project_id: string;
  year: number;
  quarter: number | null;
  report_submission_date: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
  // Joined data
  performance_indicators?: PerformanceIndicator[];
}

export interface Lock {
  id: string;
  user_id: string;
  question_id: string;
  year: number;
  quarter: number | null;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: User;
}

export interface Region {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  // Joined data
  countries?: Country[];
}

export interface Country {
  id: string;
  name: string;
  short_name: string;
  region_id: string;
  created_at: string;
  updated_at: string;
  // Joined data
  region?: Region;
}

export interface Note {
  id: string;
  description: string | null;
  user_id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: User;
}
