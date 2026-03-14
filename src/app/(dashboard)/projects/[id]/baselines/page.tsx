"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProject, useSaveBaselines } from "@/hooks/useProjects";
import { PageHeading } from "@/components/ui/page-heading";
import { Collapsible } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/modal";
import { getDataPoints, titleize } from "@/lib/utils";
import { TRAININGS, GENDERS, SUBJECTS, POSTS, EDROLES } from "@/types/constants";
import type { Question, QuestionCategory, Country } from "@/types/database";

type FormState = Record<string, string>;

function getRowKeys(category: QuestionCategory): { label: string; key: string }[] {
  switch (category) {
    case "country_training_gender":
      return TRAININGS.flatMap((t) =>
        GENDERS.map((g) => ({ label: `${titleize(t)} - ${titleize(g)}`, key: `${t}-${g}` }))
      );
    case "country_subject":
      return SUBJECTS.map((s) => ({ label: titleize(s), key: s }));
    case "country_gender":
      return GENDERS.map((g) => ({ label: titleize(g), key: g }));
    case "country_post":
      return POSTS.map((p) => ({ label: titleize(p), key: p }));
    case "country_gender_edrole":
      return GENDERS.flatMap((g) =>
        EDROLES.map((e) => ({ label: `${titleize(g)} - ${titleize(e)}`, key: `${g}-${e}` }))
      );
    default:
      return [{ label: "Value", key: "value" }];
  }
}

function isCountryLevel(category: QuestionCategory): boolean {
  return category !== "no_level";
}

export default function BaselinesPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project, isLoading, error } = useProject(id);
  const saveBaselines = useSaveBaselines();

  const initialFormState = useMemo(() => {
    if (!project) return {};
    const state: FormState = {};
    project.components?.forEach((component) => {
      component.questions?.forEach((question) => {
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

  // Merge initial state with user edits
  const mergedState = useMemo(
    () => ({ ...initialFormState, ...formState }),
    [initialFormState, formState]
  );

  const handleChange = (questionId: string, countryId: string, key: string, value: string) => {
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
      component.questions?.forEach((question) => {
        const countries = isCountryLevel(question.category) ? (project.countries || []) : [null];
        const rowKeys = getRowKeys(question.category);

        countries.forEach((country) => {
          const countryId = country?.id || "none";
          rowKeys.forEach((rk) => {
            const stateKey = `${question.id}-${countryId}-${rk.key}`;
            const val = mergedState[stateKey];
            if (val !== undefined && val !== "") {
              baselines.push({
                question_id: question.id,
                country_id: country?.id || null,
                key: rk.key === "value" && question.category === "no_level" ? null : rk.key,
                value: val,
                status,
              });
            }
          });
        });
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

      <PageHeading
        title="Baselines"
        description={project.name}
      />

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
                countries={isCountryLevel(question.category) ? (project.countries || []) : []}
                formState={mergedState}
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
  onChange,
}: {
  question: Question;
  countries: Country[];
  formState: FormState;
  onChange: (questionId: string, countryId: string, key: string, value: string) => void;
}) {
  const dataPoints = getDataPoints(question.category);
  const rowKeys = getRowKeys(question.category);
  const hasCountries = isCountryLevel(question.category) && countries.length > 0;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-800 mb-2">{question.statement}</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded">
          <thead className="bg-gray-50">
            <tr>
              {hasCountries && (
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Country
                </th>
              )}
              {dataPoints
                .filter((dp) => dp !== "Country")
                .map((dp) => (
                  <th
                    key={dp}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {dp}
                  </th>
                ))}
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Value {question.percentage && "(%)"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hasCountries
              ? countries.map((country) =>
                  rowKeys.map((rk) => (
                    <tr key={`${country.id}-${rk.key}`}>
                      <td className="px-3 py-2 text-gray-700">{country.name}</td>
                      {rk.key !== "value" && (
                        <td className="px-3 py-2 text-gray-700">{rk.label}</td>
                      )}
                      <td className="px-3 py-2">
                        <InputCell
                          question={question}
                          value={formState[`${question.id}-${country.id}-${rk.key}`] || ""}
                          onChange={(val) => onChange(question.id, country.id, rk.key, val)}
                        />
                      </td>
                    </tr>
                  ))
                )
              : rowKeys.map((rk) => (
                  <tr key={rk.key}>
                    {rk.key !== "value" && (
                      <td className="px-3 py-2 text-gray-700">{rk.label}</td>
                    )}
                    <td className="px-3 py-2">
                      <InputCell
                        question={question}
                        value={formState[`${question.id}-none-${rk.key}`] || ""}
                        onChange={(val) => onChange(question.id, "none", rk.key, val)}
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

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
      {question.percentage && <span className="text-gray-500 text-sm">%</span>}
    </div>
  );
}
