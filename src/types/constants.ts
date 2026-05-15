// Global constants matching Rails config/initializers/constants.rb

export const TRAININGS = ["ECE", "SEN"] as const;

export const GENDERS = ["male", "female"] as const;

export const LEVELS = ["pre_primary", "primary", "secondary"] as const;

export const SUBJECTS = ["literacy", "numeracy"] as const;

export const GRADES = [
  "K",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
] as const;

export const FORMS = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5"] as const;

export const POSTS = ["principal", "dty_principal", "other_leaders"] as const;

export const EDROLES = [
  "ed_officers",
  "principals",
  "teachers",
] as const;

export const MEANS_OF_VERIFICATION = [
  "Audit Reports",
  "Site Visits",
  "Press Releases",
  "Training Completion Certificates",
  "Forum Attendance Register",
  "Forum Participants Evaluation",
  "Final Survey Report",
  "Country Reports",
  "Report On Findings",
  "Consultants Report",
  "Participants Grades",
  "Completion Certificates",
  "MoE Reports",
  "Survey",
  "Endorsment Declaration From MS",
  "Approved Sips",
  "Approved Research Publications",
  "Training Report",
  "Merl System",
  "Approved Change Management Strategy For Regional And National",
  "Approved MTE Report",
  "Approved Final Program Evaluation Report",
] as const;

export const REPORTING_PERIODS = [
  { value: "yearly", label: "Yearly" },
  { value: "quarterly", label: "Quarterly" },
] as const;

export const FISCAL_YEARS = [
  { value: "july_to_june", label: "July to June" },
  { value: "october_to_september", label: "October to September" },
] as const;

export const NAV_ROUTES = [
  { path: "/projects", label: "Projects" },
  { path: "/tutorials", label: "Tutorial" },
  { path: "/help", label: "Help" },
] as const;
