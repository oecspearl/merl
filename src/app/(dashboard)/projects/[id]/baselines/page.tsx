"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProject, useSaveBaselines } from "@/hooks/useProjects";
import { PageHeading } from "@/components/ui/page-heading";
import { Collapsible } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/modal";
import { mapDataPoints, activeQuestions } from "@/lib/utils";
import { useDimensions } from "@/hooks/useDimensions";
import type { Question, QuestionCategory, Country } from "@/types/database";

type FormState = Record<string, string>;

/** A country row entry — real country or the OECS region placeholder (id = null) */
type CountryEntry = { id: string | null; name: string; short_name: string };

function isCountryLevel(category: QuestionCategory): boolean {
  return category !== "no_level";
}

/** Build country list, appending the OECS region row when question.region is true */
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

export default function BaselinesPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project, isLoading, error } = useProject(id);
  const { data: dims } = useDimensions();
  const saveBaselines = useSaveBaselines();

  const initialFormState = useMemo(() => {
    if (!project) return {};
    const state: FormState = {};
    project.components?.forEach((component) => {
      activeQuestions(component.questions).forEach((question) => {
        question.baselines?.forEach((baseline) => {
          const countryPart = baseline.country_id || "none";
          const keyPart = baseline.key || "value";
          state[`${question.id}-${countryPart}-${keyPart}`] = baseline.value || "";
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
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [`${questionId}-${countryId}-${key}`]: value,
    }));
  };

  const handleSave = (status: "draft" | "submitted") => {
    if (!project) return;

    const baselines: Array<{
      question_id: string;
      country_id: string | null;
      key: string | null;
      value: string | null;
      status: "draft" | "submitted";
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
              if (val !== undefined && val !== "") {
                baselines.push({
                  question_id: question.id,
                  country_id: entry.id,
                  key: row.key === "value" ? null : row.key,
                  value: val,
                  status,
                });
              }
            });
          });
        } else {
          // no_level questions — single row with no country
          rows.forEach((row) => {
            const stateKey = `${question.id}-none-${row.key}`;
            const val = mergedState[stateKey];
            if (val !== undefined && val !== "") {
              baselines.push({
                question_id: question.id,
                country_id: null,
                key: null,
                value: val,
                status,
              });
            }
          });
        }
      });
    });

    saveBaselines.mutate({ projectId: id, baselines });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading baselines...</div>
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

      <PageHeading title="Baselines" description={project.name} />

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
                countries={getCountryEntries(question, project.countries || [])}
                formState={mergedState}
                dims={dims}
                onChange={handleChange}
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
          disabled={saveBaselines.isPending}
        >
          Save Draft
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSave("submitted")}
          disabled={saveBaselines.isPending}
        >
          {saveBaselines.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

function QuestionTable({
  question,
  countries,
  formState,
  dims,
  onChange,
}: {
  question: Question;
  countries: CountryEntry[];
  formState: FormState;
  dims?: Record<string, string[]>;
  onChange: (
    questionId: string,
    countryId: string,
    key: string,
    value: string
  ) => void;
}) {
  const { headers, rows } = mapDataPoints(question.category, dims);
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
                Baseline {question.percentage && "(%)"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hasCountries
              ? countries.map((country) =>
                  rows.map((row, ri) => {
                    const cid = country.id || "none";
                    const showCountry = ri === 0; // only first row of country group
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
                        <td className="px-3 py-2">
                          <InputCell
                            question={question}
                            value={
                              formState[
                                `${question.id}-${cid}-${row.key}`
                              ] || ""
                            }
                            onChange={(val) =>
                              onChange(question.id, cid, row.key, val)
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
                    <td className="px-3 py-2">
                      <InputCell
                        question={question}
                        value={
                          formState[`${question.id}-none-${row.key}`] || ""
                        }
                        onChange={(val) =>
                          onChange(question.id, "none", row.key, val)
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
            name={`${question.id}-${value}-bool`}
            checked={value === "true"}
            onChange={() => onChange("true")}
            className="text-purple-600 focus:ring-purple-500"
          />
          Yes
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name={`${question.id}-${value}-bool`}
            checked={value === "false"}
            onChange={() => onChange("false")}
            className="text-purple-600 focus:ring-purple-500"
          />
          No
        </label>
      </div>
    );
  }

  // Special characters (~, -, .) represent N/A or missing data — pass through as-is
  const isSpecial = (v: string) => /^[~\-.]$/.test(v.trim());

  // For percentage questions, display as whole percentage (0.76 → 76) and store as decimal
  const displayValue = isSpecial(value) ? value
    : question.percentage && value
    ? String(Math.round(parseFloat(value) * 100 * 100) / 100)
    : value;

  const handleChange = (input: string) => {
    if (isSpecial(input) || input === "") {
      onChange(input);
    } else if (question.percentage) {
      const num = parseFloat(input);
      onChange(isNaN(num) ? input : String(num / 100));
    } else {
      onChange(input);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
      {question.percentage && (
        <span className="text-gray-500 text-sm">%</span>
      )}
    </div>
  );
}
