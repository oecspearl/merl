// Admin panel model configurations — drives the dynamic CRUD pages

export interface AdminColumn {
  key: string;
  label: string;
  format?: "date" | "currency" | "boolean" | "enum";
  enumMap?: Record<number | string, string>;
}

export interface AdminField {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "select"
    | "date"
    | "textarea"
    | "checkbox";
  required?: boolean;
  options?: { value: string; label: string }[];
  relation?: {
    table: string;
    valueField: string;
    labelField: string;
    selectQuery?: string;
  };
  placeholder?: string;
  defaultValue?: string | number | boolean | null;
  storeAsNumber?: boolean;
  nullable?: boolean;
}

export interface AdminModelConfig {
  slug: string;
  label: string;
  labelPlural: string;
  table: string;
  labelField: string;
  selectQuery: string;
  columns: AdminColumn[];
  fields: AdminField[];
  orderBy: { column: string; ascending: boolean };
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  group: "core" | "reference" | "data" | "system";
}

// Enum maps for rendering integer values as labels
export const CATEGORY_ENUM: Record<number, string> = {
  0: "No Level",
  1: "Country",
  2: "Country Training Gender",
  3: "Country Subject",
  4: "Country Gender",
  5: "Country Post",
  6: "Country Gender Edrole",
};

export const INPUT_TYPE_ENUM: Record<number, string> = {
  0: "Number",
  1: "Boolean",
};

export const REPORTING_PERIOD_ENUM: Record<number, string> = {
  0: "Yearly",
  1: "Quarterly",
};

export const FISCAL_YEAR_ENUM: Record<number, string> = {
  0: "July to June",
  1: "October to September",
};

export const STATUS_ENUM: Record<number, string> = {
  0: "Draft",
  1: "Submitted",
};

function enumToOptions(
  map: Record<number | string, string>
): { value: string; label: string }[] {
  return Object.entries(map).map(([k, v]) => ({ value: k, label: v }));
}

// All admin models
export const ADMIN_MODELS: AdminModelConfig[] = [
  // ─── Core ───────────────────────────────────────────────
  {
    slug: "projects",
    label: "Project",
    labelPlural: "Projects",
    table: "projects",
    labelField: "name",
    selectQuery: "*, countries_projects(country:countries(short_name)), created_by:users!projects_created_by_id_fkey(email), updated_by:users!projects_updated_by_id_fkey(email)",
    columns: [
      { key: "name", label: "Name" },
      { key: "donor", label: "Donor" },
      { key: "budget", label: "Budget", format: "currency" },
      {
        key: "reporting_period",
        label: "Reporting",
        format: "enum",
        enumMap: REPORTING_PERIOD_ENUM,
      },
      { key: "start_date", label: "Start", format: "date" },
      { key: "end_date", label: "End", format: "date" },
      { key: "created_by.email", label: "Created By" },
      { key: "updated_by.email", label: "Updated By" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "donor", label: "Donor", type: "text" },
      { name: "budget", label: "Budget", type: "number" },
      { name: "approval_date", label: "Approval Date", type: "date" },
      { name: "start_date", label: "Start Date", type: "date" },
      { name: "end_date", label: "End Date", type: "date" },
      {
        name: "reporting_period",
        label: "Reporting Period",
        type: "select",
        options: enumToOptions(REPORTING_PERIOD_ENUM),
        storeAsNumber: true,
        defaultValue: 0,
      },
      {
        name: "fiscal_year",
        label: "Fiscal Year",
        type: "select",
        options: enumToOptions(FISCAL_YEAR_ENUM),
        storeAsNumber: true,
        defaultValue: 0,
      },
    ],
    orderBy: { column: "created_at", ascending: false },
    canCreate: true,
    canEdit: true,
    canDelete: true,
    group: "core",
  },
  {
    slug: "components",
    label: "Component",
    labelPlural: "Components",
    table: "components",
    labelField: "title",
    selectQuery: "*, project:projects(name)",
    columns: [
      { key: "title", label: "Title" },
      { key: "project.name", label: "Project" },
      { key: "objective", label: "Objective" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "project_id",
        label: "Project",
        type: "select",
        required: true,
        relation: {
          table: "projects",
          valueField: "id",
          labelField: "name",
        },
      },
      { name: "objective", label: "Objective", type: "textarea" },
      { name: "outcomes", label: "Outcomes", type: "textarea" },
      { name: "output", label: "Output", type: "textarea" },
    ],
    orderBy: { column: "created_at", ascending: false },
    canCreate: true,
    canEdit: true,
    canDelete: true,
    group: "core",
  },
  {
    slug: "questions",
    label: "Question",
    labelPlural: "Questions",
    table: "questions",
    labelField: "statement",
    selectQuery: "*, component:components(title, project:projects(name))",
    columns: [
      { key: "statement", label: "Statement" },
      { key: "component.title", label: "Component" },
      {
        key: "category",
        label: "Category",
        format: "enum",
        enumMap: CATEGORY_ENUM,
      },
      {
        key: "input_type",
        label: "Input Type",
        format: "enum",
        enumMap: INPUT_TYPE_ENUM,
      },
    ],
    fields: [
      { name: "statement", label: "Statement", type: "textarea", required: true },
      {
        name: "component_id",
        label: "Component",
        type: "select",
        required: true,
        relation: {
          table: "components",
          valueField: "id",
          labelField: "title",
          selectQuery: "id, title, project:projects(name)",
        },
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: enumToOptions(CATEGORY_ENUM),
        storeAsNumber: true,
        defaultValue: 0,
      },
      {
        name: "input_type",
        label: "Input Type",
        type: "select",
        options: enumToOptions(INPUT_TYPE_ENUM),
        storeAsNumber: true,
        defaultValue: 0,
      },
      {
        name: "percentage",
        label: "Is Percentage",
        type: "checkbox",
        defaultValue: false,
      },
      {
        name: "region",
        label: "Include Region",
        type: "checkbox",
        defaultValue: false,
      },
    ],
    orderBy: { column: "created_at", ascending: false },
    canCreate: true,
    canEdit: true,
    canDelete: true,
    group: "core",
  },

  // ─── Reference ──────────────────────────────────────────
  {
    slug: "regions",
    label: "Region",
    labelPlural: "Regions",
    table: "regions",
    labelField: "name",
    selectQuery: "*",
    columns: [
      { key: "name", label: "Name" },
      { key: "created_at", label: "Created", format: "date" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
    ],
    orderBy: { column: "name", ascending: true },
    canCreate: true,
    canEdit: true,
    canDelete: true,
    group: "reference",
  },
  {
    slug: "countries",
    label: "Country",
    labelPlural: "Countries",
    table: "countries",
    labelField: "name",
    selectQuery: "*, region:regions(name)",
    columns: [
      { key: "name", label: "Name" },
      { key: "short_name", label: "Short Name" },
      { key: "region.name", label: "Region" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "short_name", label: "Short Name", type: "text", required: true },
      {
        name: "region_id",
        label: "Region",
        type: "select",
        required: true,
        relation: {
          table: "regions",
          valueField: "id",
          labelField: "name",
        },
      },
    ],
    orderBy: { column: "name", ascending: true },
    canCreate: true,
    canEdit: true,
    canDelete: true,
    group: "reference",
  },
  {
    slug: "countries-projects",
    label: "Project Country",
    labelPlural: "Project Countries",
    table: "countries_projects",
    labelField: "id",
    selectQuery: "*, country:countries(name), project:projects(name)",
    columns: [
      { key: "project.name", label: "Project" },
      { key: "country.name", label: "Country" },
    ],
    fields: [
      {
        name: "project_id",
        label: "Project",
        type: "select",
        required: true,
        relation: {
          table: "projects",
          valueField: "id",
          labelField: "name",
        },
      },
      {
        name: "country_id",
        label: "Country",
        type: "select",
        required: true,
        relation: {
          table: "countries",
          valueField: "id",
          labelField: "name",
        },
      },
    ],
    orderBy: { column: "project_id", ascending: true },
    canCreate: true,
    canEdit: false,
    canDelete: true,
    group: "reference",
  },

  // ─── Data ───────────────────────────────────────────────
  {
    slug: "baselines",
    label: "Baseline",
    labelPlural: "Baselines",
    table: "baselines",
    labelField: "id",
    selectQuery: "*, question:questions(statement), country:countries(name), created_by:users!baselines_created_by_id_fkey(email), updated_by:users!baselines_updated_by_id_fkey(email)",
    columns: [
      { key: "question.statement", label: "Question" },
      { key: "country.name", label: "Country" },
      { key: "key", label: "Key" },
      { key: "value", label: "Value" },
      { key: "status", label: "Status", format: "enum", enumMap: STATUS_ENUM },
      { key: "updated_by.email", label: "Updated By" },
    ],
    fields: [
      {
        name: "question_id",
        label: "Question",
        type: "select",
        required: true,
        relation: {
          table: "questions",
          valueField: "id",
          labelField: "statement",
        },
      },
      {
        name: "country_id",
        label: "Country",
        type: "select",
        nullable: true,
        relation: {
          table: "countries",
          valueField: "id",
          labelField: "name",
        },
      },
      { name: "key", label: "Key", type: "text" },
      { name: "value", label: "Value", type: "text" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: enumToOptions(STATUS_ENUM),
        storeAsNumber: true,
        defaultValue: 0,
      },
    ],
    orderBy: { column: "created_at", ascending: false },
    canCreate: true,
    canEdit: true,
    canDelete: true,
    group: "data",
  },
  {
    slug: "targets",
    label: "Target",
    labelPlural: "Targets",
    table: "targets",
    labelField: "id",
    selectQuery: "*, question:questions(statement), country:countries(name), created_by:users!targets_created_by_id_fkey(email), updated_by:users!targets_updated_by_id_fkey(email)",
    columns: [
      { key: "question.statement", label: "Question" },
      { key: "country.name", label: "Country" },
      { key: "key", label: "Key" },
      { key: "year", label: "Year" },
      { key: "value", label: "Value" },
      { key: "status", label: "Status", format: "enum", enumMap: STATUS_ENUM },
      { key: "updated_by.email", label: "Updated By" },
    ],
    fields: [
      {
        name: "question_id",
        label: "Question",
        type: "select",
        required: true,
        relation: {
          table: "questions",
          valueField: "id",
          labelField: "statement",
        },
      },
      {
        name: "country_id",
        label: "Country",
        type: "select",
        nullable: true,
        relation: {
          table: "countries",
          valueField: "id",
          labelField: "name",
        },
      },
      { name: "key", label: "Key", type: "text" },
      { name: "year", label: "Year", type: "text", required: true },
      { name: "value", label: "Value", type: "text" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: enumToOptions(STATUS_ENUM),
        storeAsNumber: true,
        defaultValue: 0,
      },
    ],
    orderBy: { column: "created_at", ascending: false },
    canCreate: true,
    canEdit: true,
    canDelete: true,
    group: "data",
  },
  {
    slug: "project-responses",
    label: "Project Response",
    labelPlural: "Project Responses",
    table: "project_responses",
    labelField: "id",
    selectQuery: "*, project:projects(name)",
    columns: [
      { key: "project.name", label: "Project" },
      { key: "year", label: "Year" },
      { key: "quarter", label: "Quarter" },
      { key: "status", label: "Status", format: "enum", enumMap: STATUS_ENUM },
      {
        key: "report_submission_date",
        label: "Submitted",
        format: "date",
      },
    ],
    fields: [
      {
        name: "project_id",
        label: "Project",
        type: "select",
        required: true,
        relation: {
          table: "projects",
          valueField: "id",
          labelField: "name",
        },
      },
      { name: "year", label: "Year", type: "number", required: true },
      { name: "quarter", label: "Quarter", type: "number" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: enumToOptions(STATUS_ENUM),
        storeAsNumber: true,
        defaultValue: 0,
      },
      {
        name: "report_submission_date",
        label: "Submission Date",
        type: "date",
      },
    ],
    orderBy: { column: "created_at", ascending: false },
    canCreate: true,
    canEdit: true,
    canDelete: true,
    group: "data",
  },

  // ─── System ─────────────────────────────────────────────
  {
    slug: "users",
    label: "User",
    labelPlural: "Users",
    table: "users",
    labelField: "email",
    selectQuery: "*",
    columns: [
      { key: "email", label: "Email" },
      { key: "type", label: "Type" },
      { key: "created_at", label: "Created", format: "date" },
    ],
    fields: [
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: [
          { value: "User", label: "User" },
          { value: "SuperAdmin", label: "SuperAdmin" },
        ],
        defaultValue: "User",
      },
    ],
    orderBy: { column: "created_at", ascending: false },
    canCreate: false, // Users are created via auth or CSV import
    canEdit: true,
    canDelete: false,
    group: "system",
  },
  {
    slug: "notes",
    label: "Note",
    labelPlural: "Notes",
    table: "notes",
    labelField: "description",
    selectQuery: "*, user:users(email), project:projects(name)",
    columns: [
      { key: "project.name", label: "Project" },
      { key: "user.email", label: "User" },
      { key: "description", label: "Description" },
      { key: "created_at", label: "Created", format: "date" },
    ],
    fields: [
      { name: "description", label: "Description", type: "textarea" },
    ],
    orderBy: { column: "created_at", ascending: false },
    canCreate: false,
    canEdit: false,
    canDelete: true,
    group: "system",
  },
  {
    slug: "locks",
    label: "Lock",
    labelPlural: "Locks",
    table: "locks",
    labelField: "id",
    selectQuery: "*, user:users(email), question:questions(statement)",
    columns: [
      { key: "user.email", label: "User" },
      { key: "question.statement", label: "Question" },
      { key: "year", label: "Year" },
      { key: "quarter", label: "Quarter" },
      { key: "created_at", label: "Created", format: "date" },
    ],
    fields: [],
    orderBy: { column: "created_at", ascending: false },
    canCreate: false,
    canEdit: false,
    canDelete: true,
    group: "system",
  },
];

export function getModelConfig(slug: string): AdminModelConfig | undefined {
  return ADMIN_MODELS.find((m) => m.slug === slug);
}

export const ADMIN_GROUPS = [
  { key: "core", label: "Core" },
  { key: "reference", label: "Reference" },
  { key: "data", label: "Data" },
  { key: "system", label: "System" },
] as const;
