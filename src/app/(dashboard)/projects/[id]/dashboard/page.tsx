"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useProject } from "@/hooks/useProjects";
import { Collapsible } from "@/components/ui/collapsible";
import { getProjectYears } from "@/lib/utils";
import { QuestionCharts } from "@/components/charts/question-charts";

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: project, isLoading } = useProject(id);

  const years = useMemo(
    () =>
      project ? getProjectYears(project.start_date, project.end_date) : [],
    [project]
  );

  const quarters = [1, 2, 3, 4];
  const countries = useMemo(() => project?.countries ?? [], [project]);

  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedQuarters, setSelectedQuarters] = useState<number[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [oecs, setOecs] = useState(false);

  // Initialize filters once project loads
  useEffect(() => {
    if (years.length > 0 && selectedYears.length === 0) {
      setSelectedYears(years);
    }
    if (selectedQuarters.length === 0) {
      setSelectedQuarters(quarters);
    }
    if (countries.length > 0 && selectedCountries.length === 0) {
      setSelectedCountries(countries.map((c) => c.name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [years, countries]);

  function toggleYear(year: number) {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  }

  function toggleQuarter(q: number) {
    setSelectedQuarters((prev) =>
      prev.includes(q) ? prev.filter((v) => v !== q) : [...prev, q]
    );
  }

  function toggleCountry(name: string) {
    setSelectedCountries((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  }

  // Check if there's submitted data to show (mirrors Rails submitted_targets? && submitted_project_responses?)
  const hasSubmittedData = useMemo(() => {
    if (!project) return false;
    const hasSubmittedTargets = (project.components ?? []).some((c) =>
      (c.questions ?? []).some((q) =>
        (q.targets ?? []).some((t) => t.status === "submitted")
      )
    );
    const hasSubmittedResponses = (project.project_responses ?? []).some(
      (pr) => pr.status === "submitted"
    );
    return hasSubmittedTargets && hasSubmittedResponses;
  }, [project]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12 text-gray-500">Project not found.</div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/projects/${id}`)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {project.name}
            </h1>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Years */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                Years
              </label>
              <div className="flex flex-wrap gap-2">
                {years.map((year) => (
                  <label
                    key={year}
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(year)}
                      onChange={() => toggleYear(year)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    {year}
                  </label>
                ))}
              </div>
            </div>

            {/* Quarters */}
            {project.reporting_period === "quarterly" && (
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">
                  Quarters
                </label>
                <div className="flex flex-wrap gap-2">
                  {quarters.map((q) => (
                    <label
                      key={q}
                      className="flex items-center gap-1.5 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedQuarters.includes(q)}
                        onChange={() => toggleQuarter(q)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      Q{q}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Countries */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                Countries
              </label>
              <div className="flex flex-wrap gap-2">
                {countries.map((country) => (
                  <label
                    key={country.id}
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country.name)}
                      onChange={() => toggleCountry(country.name)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    {country.short_name}
                  </label>
                ))}
              </div>
            </div>

            {/* OECS Toggle */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                Aggregation
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={oecs}
                  onChange={() => setOecs(!oecs)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                OECS (All Countries)
              </label>
            </div>
          </div>
        </div>

        {/* Charts by Component */}
        {hasSubmittedData ? (
          (project.components ?? []).map((component) => (
            <Collapsible
              key={component.id}
              title={component.title}
              subtitle={component.objective ?? undefined}
              defaultOpen
            >
              <div className="space-y-8">
                {(component.questions ?? [])
                  .filter((q) => q.input_type !== "boolean")
                  .filter((q) => q.category !== "no_level")
                  .map((question) => (
                    <div
                      key={question.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                    >
                      <h4 className="text-sm font-medium text-gray-800 mb-4">
                        {question.statement ?? "Untitled Question"}
                      </h4>
                      <QuestionCharts
                        project={project}
                        question={question}
                        selectedYears={selectedYears}
                        selectedQuarters={selectedQuarters}
                        selectedCountryNames={selectedCountries}
                        oecs={oecs}
                      />
                    </div>
                  ))}
              </div>
            </Collapsible>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500">
              Graphs cannot be displayed due to unavailability of data
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Submit targets and performance indicators to view charts.
            </p>
          </div>
        )}

        {hasSubmittedData && (project.components ?? []).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No components found for this project.
          </div>
        )}
      </div>
    </div>
  );
}
