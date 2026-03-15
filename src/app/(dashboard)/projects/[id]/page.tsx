"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, StickyNote, BarChart3, FileText } from "lucide-react";
import { useProject, useSavePerformanceIndicators } from "@/hooks/useProjects";
import { PageHeading } from "@/components/ui/page-heading";
import { Collapsible } from "@/components/ui/collapsible";
import { Modal, Button } from "@/components/ui/modal";
import { mapDataPoints, getProjectYears, getCurrentQuarter, cn, activeQuestions } from "@/lib/utils";
import { useDimensions } from "@/hooks/useDimensions";
import { MEANS_OF_VERIFICATION } from "@/types/constants";
import { LockToggle } from "@/components/ui/lock-toggle";
import type { Question, QuestionCategory, Country, ProjectResponse } from "@/types/database";

type FormState = Record<string, string>;
type MoVState = Record<string, string[]>;
type CountryEntry = { id: string | null; name: string; short_name: string };

function isCountryLevel(category: QuestionCategory): boolean {
  return category !== "no_level";
}

function getCountryEntries(
  question: Question,
  countries: Country[]
): CountryEntry[] {
  if (!isCountryLevel(question.category)) return [];
  const entries: CountryEntry[] = countries.map((c) => ({
    id: c.id,
    name: c.name,
    short_name: c.short_name,
  }));
  if (question.region) {
    const regionName =
      (countries[0] as Country & { region?: { name: string } })?.region?.name ||
      "OECS";
    entries.push({ id: null, name: regionName, short_name: regionName });
  }
  return entries;
}

function getBaselineValue(
  question: Question,
  countryId: string | null,
  key: string
): string {
  const baseline = question.baselines?.find(
    (b) =>
      (b.country_id || null) === countryId && (b.key || "value") === key
  );
  return baseline?.value || "";
}

function getTargetValue(
  question: Question,
  countryId: string | null,
  key: string,
  year: number
): string {
  const target = question.targets?.find(
    (t) =>
      (t.country_id || null) === countryId &&
      (t.key || "value") === key &&
      t.year === String(year)
  );
  return target?.value || "";
}

function hasBaselinesOrTargets(project: {
  components?: { questions?: Question[] }[];
}): boolean {
  return (
    project.components?.some((c) =>
      c.questions?.some(
        (q) =>
          (q.baselines && q.baselines.length > 0) ||
          (q.targets && q.targets.length > 0)
      )
    ) || false
  );
}

export default function ProjectShowPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project, isLoading, error } = useProject(id);
  const { data: dims } = useDimensions();
  const saveIndicators = useSavePerformanceIndicators();

  const years = useMemo(
    () =>
      project ? getProjectYears(project.start_date, project.end_date) : [],
    [project]
  );

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [pendingSaveStatus, setPendingSaveStatus] = useState<
    "draft" | "submitted" | null
  >(null);

  const activeYear = selectedYear ?? years[0] ?? null;
  const activeQuarter =
    selectedQuarter ??
    (project ? getCurrentQuarter(project.fiscal_year) : 1);

  const activeResponse = useMemo(() => {
    if (!project || !activeYear) return null;
    return (
      project.project_responses?.find(
        (pr) => pr.year === activeYear && pr.quarter === activeQuarter
      ) || null
    );
  }, [project, activeYear, activeQuarter]);

  const initialFormState = useMemo(() => {
    if (!activeResponse) return {};
    const state: FormState = {};
    activeResponse.performance_indicators?.forEach((pi) => {
      const countryPart = pi.country_id || "none";
      const keyPart = pi.key || "value";
      state[`${pi.question_id}-${countryPart}-${keyPart}`] = pi.value || "";
    });
    return state;
  }, [activeResponse]);

  const initialMoVState = useMemo(() => {
    if (!activeResponse) return {};
    const state: MoVState = {};
    activeResponse.performance_indicators?.forEach((pi) => {
      const countryPart = pi.country_id || "none";
      const keyPart = pi.key || "value";
      const movKey = `${pi.question_id}-${countryPart}-${keyPart}`;
      if (pi.means_of_verification) {
        state[movKey] = pi.means_of_verification
          .split(",")
          .map((s) => s.trim());
      }
    });
    return state;
  }, [activeResponse]);

  const [formState, setFormState] = useState<FormState>({});
  const [movState, setMovState] = useState<MoVState>({});

  const mergedState = useMemo(
    () => ({ ...initialFormState, ...formState }),
    [initialFormState, formState]
  );

  const mergedMoV = useMemo(
    () => ({ ...initialMoVState, ...movState }),
    [initialMoVState, movState]
  );

  const handleChange = (
    questionId: string,
    countryId: string,
    key: string,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [`${questionId}-${countryId}-${key}`]: value,
    }));
  };

  const handleMoVChange = (
    questionId: string,
    countryId: string,
    key: string,
    values: string[]
  ) => {
    setMovState((prev) => ({
      ...prev,
      [`${questionId}-${countryId}-${key}`]: values,
    }));
  };

  const executeSave = (status: "draft" | "submitted") => {
    if (!project || !activeYear) return;

    const indicators: Array<{
      question_id: string;
      country_id: string | null;
      key: string | null;
      value: string | null;
      means_of_verification: string | null;
    }> = [];

    project.components?.forEach((component) => {
      activeQuestions(component.questions).forEach((question) => {
        const entries = getCountryEntries(question, project.countries || []);
        const { rows } = mapDataPoints(question.category, dims);

        if (entries.length > 0) {
          entries.forEach((entry) => {
            const countryId = entry.id || "none";
            rows.forEach((row) => {
              const stateKey = `${question.id}-${countryId}-${row.key}`;
              const val = mergedState[stateKey];
              const mov = mergedMoV[stateKey];

              if (
                (val !== undefined && val !== "") ||
                (mov && mov.length > 0)
              ) {
                indicators.push({
                  question_id: question.id,
                  country_id: entry.id,
                  key: row.key === "value" ? null : row.key,
                  value: val || null,
                  means_of_verification:
                    mov && mov.length > 0 ? mov.join(", ") : null,
                });
              }
            });
          });
        } else {
          rows.forEach((row) => {
            const stateKey = `${question.id}-none-${row.key}`;
            const val = mergedState[stateKey];
            const mov = mergedMoV[stateKey];

            if (
              (val !== undefined && val !== "") ||
              (mov && mov.length > 0)
            ) {
              indicators.push({
                question_id: question.id,
                country_id: null,
                key: null,
                value: val || null,
                means_of_verification:
                  mov && mov.length > 0 ? mov.join(", ") : null,
              });
            }
          });
        }
      });
    });

    saveIndicators.mutate({
      projectId: id,
      year: activeYear,
      quarter: activeQuarter,
      status,
      indicators,
    });
  };

  const handleSave = (status: "draft" | "submitted") => {
    if (activeResponse && status === "submitted") {
      setPendingSaveStatus(status);
      setShowOverwriteModal(true);
    } else {
      executeSave(status);
    }
  };

  const confirmOverwrite = () => {
    if (pendingSaveStatus) {
      executeSave(pendingSaveStatus);
    }
    setShowOverwriteModal(false);
    setPendingSaveStatus(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading project...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load project: {error.message}
      </div>
    );
  }

  if (!project) return null;

  const hasData = hasBaselinesOrTargets(project);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/projects"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/projects/${id}/dashboard`}>
            <Button variant="secondary" size="sm">
              <BarChart3 className="w-4 h-4 mr-1 inline" />
              Dashboard
            </Button>
          </Link>
          <Link href={`/projects/${id}/reports`}>
            <Button variant="secondary" size="sm">
              <FileText className="w-4 h-4 mr-1 inline" />
              Reports
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowNotes(!showNotes)}
          >
            <StickyNote className="w-4 h-4 mr-1 inline" />
            Notes
          </Button>
          <Link href={`/projects/${id}/export`}>
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-1 inline" />
              Export
            </Button>
          </Link>
        </div>
      </div>

      <PageHeading title={project.name} description="Performance Indicators" />

      {/* Empty state */}
      {!hasData && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">
            No baselines or targets have been set up yet. You need to configure
            them before entering performance indicators.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href={`/projects/${id}/baselines`}>
              <Button variant="primary">Set Up Baselines</Button>
            </Link>
            <Link href={`/projects/${id}/targets`}>
              <Button variant="secondary">Set Up Targets</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main content when data exists */}
      {hasData && (
        <>
          {/* Year Selector */}
          {years.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-600 mr-2">
                Year:
              </span>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    activeYear === year
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Quarter Selector */}
          {project.reporting_period === "quarterly" && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium text-gray-600 mr-2">
                Quarter:
              </span>
              {[1, 2, 3, 4].map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    activeQuarter === q
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  )}
                >
                  Q{q}
                </button>
              ))}
            </div>
          )}

          {/* Components and Questions */}
          <div className="space-y-6">
            {[...(project.components || [])].sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true })).map((component) => (
              <Collapsible
                key={component.id}
                title={component.title}
                subtitle={component.objective || undefined}
              >
                {activeQuestions(component.questions).map((question) => (
                  <QuestionTable
                    key={question.id}
                    question={question}
                    countries={getCountryEntries(
                      question,
                      project.countries || []
                    )}
                    year={activeYear!}
                    quarter={activeQuarter}
                    formState={mergedState}
                    movState={mergedMoV}
                    dims={dims}
                    onChange={handleChange}
                    onMoVChange={handleMoVChange}
                  />
                ))}
              </Collapsible>
            ))}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 mt-8 -mx-6 flex items-center justify-end gap-3">
            <Link href="/projects">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => handleSave("draft")}
              disabled={saveIndicators.isPending}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSave("submitted")}
              disabled={saveIndicators.isPending}
            >
              {saveIndicators.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </>
      )}

      {/* Notes Drawer */}
      {showNotes && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-40 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
            <button
              onClick={() => setShowNotes(false)}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {project.notes && project.notes.length > 0 ? (
              project.notes.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded p-3 text-sm">
                  <p className="text-gray-700">{note.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {note.user?.email} &middot;{" "}
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No notes yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Overwrite Confirmation Modal */}
      <Modal
        open={showOverwriteModal}
        onClose={() => setShowOverwriteModal(false)}
        title="Overwrite Existing Data?"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowOverwriteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmOverwrite}>
              Confirm
            </Button>
          </>
        }
      >
        <p>
          A response for this year and quarter already exists. Saving will
          overwrite the existing performance indicator values. Are you sure you
          want to continue?
        </p>
      </Modal>
    </div>
  );
}

function QuestionTable({
  question,
  countries,
  year,
  quarter,
  formState,
  movState,
  dims,
  onChange,
  onMoVChange,
}: {
  question: Question;
  countries: CountryEntry[];
  year: number;
  quarter: number | null;
  formState: FormState;
  movState: MoVState;
  dims?: Record<string, string[]>;
  onChange: (
    questionId: string,
    countryId: string,
    key: string,
    value: string
  ) => void;
  onMoVChange: (
    questionId: string,
    countryId: string,
    key: string,
    values: string[]
  ) => void;
}) {
  const { headers, rows } = mapDataPoints(question.category, dims);
  const hasCountries = countries.length > 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-800">
          {question.statement}
        </h4>
        <LockToggle questionId={question.id} year={year} quarter={quarter} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded">
          <thead className="bg-gray-50">
            <tr>
              {hasCountries && (
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Country
                </th>
              )}
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Baseline
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Target
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Current Progress {question.percentage && "(%)"}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Means of Verification
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hasCountries
              ? countries.map((country) =>
                  rows.map((row, ri) => {
                    const cid = country.id || "none";
                    const stateKey = `${question.id}-${cid}-${row.key}`;
                    const showCountry = ri === 0;
                    return (
                      <tr key={`${cid}-${row.key}`}>
                        <td className="px-3 py-2 text-gray-700 font-medium">
                          {showCountry ? country.short_name : ""}
                        </td>
                        {row.cells.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="px-3 py-2 text-gray-700"
                          >
                            {cell}
                          </td>
                        ))}
                        <td className="px-3 py-2 text-gray-500">
                          {getBaselineValue(
                            question,
                            country.id,
                            row.key
                          ) || "--"}
                        </td>
                        <td className="px-3 py-2 text-gray-500">
                          {getTargetValue(
                            question,
                            country.id,
                            row.key,
                            year
                          ) || "--"}
                        </td>
                        <td className="px-3 py-2">
                          <InputCell
                            question={question}
                            value={formState[stateKey] || ""}
                            onChange={(val) =>
                              onChange(question.id, cid, row.key, val)
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <MoVSelect
                            selected={movState[stateKey] || []}
                            onChange={(vals) =>
                              onMoVChange(question.id, cid, row.key, vals)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })
                )
              : rows.map((row) => {
                  const stateKey = `${question.id}-none-${row.key}`;
                  return (
                    <tr key={row.key}>
                      {row.cells.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="px-3 py-2 text-gray-700"
                        >
                          {cell}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-gray-500">
                        {getBaselineValue(question, null, row.key) || "--"}
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        {getTargetValue(question, null, row.key, year) || "--"}
                      </td>
                      <td className="px-3 py-2">
                        <InputCell
                          question={question}
                          value={formState[stateKey] || ""}
                          onChange={(val) =>
                            onChange(question.id, "none", row.key, val)
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <MoVSelect
                          selected={movState[stateKey] || []}
                          onChange={(vals) =>
                            onMoVChange(question.id, "none", row.key, vals)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InputCell({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (val: string) => void;
}) {
  if (question.input_type === "boolean") {
    return (
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            checked={value === "true"}
            onChange={() => onChange("true")}
            className="text-purple-600 focus:ring-purple-500"
          />
          Yes
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            checked={value === "false"}
            onChange={() => onChange("false")}
            className="text-purple-600 focus:ring-purple-500"
          />
          No
        </label>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
      {question.percentage && (
        <span className="text-gray-500 text-sm">%</span>
      )}
    </div>
  );
}

function MoVSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-48 text-left rounded-md border border-gray-300 px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      >
        {selected.length > 0 ? `${selected.length} selected` : "Select..."}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {MEANS_OF_VERIFICATION.map((mov) => (
            <label
              key={mov}
              className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(mov)}
                onChange={() => toggleOption(mov)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              {mov}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
