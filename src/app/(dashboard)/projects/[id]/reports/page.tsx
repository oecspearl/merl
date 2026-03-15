"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { useProject } from "@/hooks/useProjects";
import { Collapsible } from "@/components/ui/collapsible";
import { getProjectYears, cn, activeQuestions } from "@/lib/utils";
import { QuestionCharts } from "@/components/charts/question-charts";

export default function ReportsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: project, isLoading } = useProject(id);

  const years = useMemo(
    () => (project ? getProjectYears(project.start_date, project.end_date) : []),
    [project]
  );

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const activeYear = selectedYear ?? years[0] ?? null;

  const countries = useMemo(() => project?.countries ?? [], [project]);
  const countryNames = useMemo(() => countries.map((c) => c.name), [countries]);

  // Check if there's submitted data to show
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
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 print:static print:border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/projects/${id}`)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 print:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {project.name}
              </h1>
              <p className="text-sm text-gray-500">Reports</p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors print:hidden"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Year Selector */}
        {years.length > 0 && (
          <div className="flex items-center gap-2 mb-6 print:hidden">
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

        {/* Print header with year */}
        <div className="hidden print:block mb-4">
          <p className="text-sm text-gray-600">Year: {activeYear}</p>
        </div>

        {/* Charts by Component */}
        {hasSubmittedData && activeYear ? (
          [...(project.components ?? [])].sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true })).map((component) => (
            <Collapsible
              key={component.id}
              title={component.title}
              subtitle={component.objective ?? undefined}
              defaultOpen
            >
              <div className="space-y-8">
                {activeQuestions(component.questions)
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
                        selectedYears={[activeYear]}
                        selectedQuarters={[1, 2, 3, 4]}
                        selectedCountryNames={countryNames}
                        oecs={false}
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
              Submit targets and performance indicators to view reports.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
