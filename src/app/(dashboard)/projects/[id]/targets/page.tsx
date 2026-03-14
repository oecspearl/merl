"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProject, useSaveTargets } from "@/hooks/useProjects";
import { PageHeading } from "@/components/ui/page-heading";
import { Collapsible } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/modal";
import { mapDataPoints, getProjectYears, cn } from "@/lib/utils";
import type { Question, QuestionCategory, Country } from "@/types/database";

type FormState = Record<string, string>;
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

export default function TargetsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project, isLoading, error } = useProject(id);
  const saveTargets = useSaveTargets();

  const years = useMemo(
    () => (project ? getProjectYears(project.start_date, project.end_date) : []),
    [project]
  );

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const activeYear = selectedYear ?? years[0] ?? null;

  const initialFormState = useMemo(() => {
    if (!project) return {};
    const state: FormState = {};
    project.components?.forEach((component) => {
      component.questions?.forEach((question) => {
        question.targets?.forEach((target) => {
          const countryPart = target.country_id || "none";
          const keyPart = target.key || "value";
          state[`${question.id}-${countryPart}-${keyPart}-${target.year}`] =
            target.value || "";
        });
      });
    });
    return state;
  }, [project]);

  const [formState, setFormState] = useState<FormState>({});

  const mergedState = useMemo(
    () => ({ ...initialFormState, ...formState }),
    [initialFormState, formState]
  );

  const handleChange = (
    questionId: string,
    countryId: string,
    key: string,
    year: number,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [`${questionId}-${countryId}-${key}-${year}`]: value,
    }));
  };

  const handleSave = (status: "draft" | "submitted") => {
    if (!project || !activeYear) return;

    const targets: Array<{
      question_id: string;
      country_id: string | null;
      key: string | null;
      year: string;
      value: string | null;
      status: "draft" | "submitted";
    }> = [];

    project.components?.forEach((component) => {
      component.questions?.forEach((question) => {
        const entries = getCountryEntries(question, project.countries || []);
        const { rows } = mapDataPoints(question.category);

        if (entries.length > 0) {
          entries.forEach((entry) => {
            const countryId = entry.id || "none";
            rows.forEach((row) => {
              const stateKey = `${question.id}-${countryId}-${row.key}-${activeYear}`;
              const val = mergedState[stateKey];
              if (val !== undefined && val !== "") {
                targets.push({
                  question_id: question.id,
                  country_id: entry.id,
                  key: row.key === "value" ? null : row.key,
                  year: String(activeYear),
                  value: val,
                  status,
                });
              }
            });
          });
        } else {
          rows.forEach((row) => {
            const stateKey = `${question.id}-none-${row.key}-${activeYear}`;
            const val = mergedState[stateKey];
            if (val !== undefined && val !== "") {
              targets.push({
                question_id: question.id,
                country_id: null,
                key: null,
                year: String(activeYear),
                value: val,
                status,
              });
            }
          });
        }
      });
    });

    saveTargets.mutate({ projectId: id, targets });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading targets...</div>
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

  return (
    <div>
      <Link
        href="/projects"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Projects
      </Link>

      <PageHeading title="Targets" description={project.name} />

      {/* Year Selector */}
      {years.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
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

      {activeYear && (
        <div className="space-y-6">
          {project.components?.map((component) => (
            <Collapsible
              key={component.id}
              title={component.title}
              subtitle={component.objective || undefined}
            >
              {component.questions?.map((question) => (
                <QuestionTable
                  key={question.id}
                  question={question}
                  countries={getCountryEntries(question, project.countries || [])}
                  year={activeYear}
                  formState={mergedState}
                  onChange={handleChange}
                />
              ))}
            </Collapsible>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 mt-8 -mx-6 flex items-center justify-end gap-3">
        <Link href="/projects">
          <Button variant="secondary">Cancel</Button>
        </Link>
        <Button
          variant="secondary"
          onClick={() => handleSave("draft")}
          disabled={saveTargets.isPending}
        >
          Save Draft
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSave("submitted")}
          disabled={saveTargets.isPending}
        >
          {saveTargets.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

function QuestionTable({
  question,
  countries,
  year,
  formState,
  onChange,
}: {
  question: Question;
  countries: CountryEntry[];
  year: number;
  formState: FormState;
  onChange: (
    questionId: string,
    countryId: string,
    key: string,
    year: number,
    value: string
  ) => void;
}) {
  const { headers, rows } = mapDataPoints(question.category);
  const hasCountries = countries.length > 0;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-800 mb-2">
        {question.statement}
      </h4>
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
                Target {question.percentage && "(%)"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hasCountries
              ? countries.map((country) =>
                  rows.map((row, ri) => {
                    const cid = country.id || "none";
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
                          {getBaselineValue(question, country.id, row.key) ||
                            "--"}
                          {question.percentage &&
                          getBaselineValue(question, country.id, row.key)
                            ? "%"
                            : ""}
                        </td>
                        <td className="px-3 py-2">
                          <InputCell
                            question={question}
                            value={
                              formState[
                                `${question.id}-${cid}-${row.key}-${year}`
                              ] || ""
                            }
                            onChange={(val) =>
                              onChange(question.id, cid, row.key, year, val)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })
                )
              : rows.map((row) => (
                  <tr key={row.key}>
                    {row.cells.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-3 py-2 text-gray-700">
                        {cell}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-gray-500">
                      {getBaselineValue(question, null, row.key) || "--"}
                      {question.percentage &&
                      getBaselineValue(question, null, row.key)
                        ? "%"
                        : ""}
                    </td>
                    <td className="px-3 py-2">
                      <InputCell
                        question={question}
                        value={
                          formState[
                            `${question.id}-none-${row.key}-${year}`
                          ] || ""
                        }
                        onChange={(val) =>
                          onChange(question.id, "none", row.key, year, val)
                        }
                      />
                    </td>
                  </tr>
                ))}
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
        type="number"
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
