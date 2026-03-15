"use client";

import type { Project, Question } from "@/types/database";
import type { ChartDataPoint } from "@/lib/chart-utils";
import { buildPerformanceData, filterBySelections } from "@/lib/chart-utils";
import { CountryColumnChart } from "./country-chart";
import { GenderColumnChart } from "./gender-chart";
import { TrainingGenderColumnChart } from "./training-gender-chart";
import { GenderRoleColumnChart } from "./gender-role-chart";
import { PostColumnChart } from "./post-chart";
import { SubjectColumnChart } from "./subject-chart";
import { TimeSeriesChart } from "./time-series-chart";

interface QuestionChartsProps {
  project: Project;
  question: Question;
  selectedYears: number[];
  selectedQuarters: number[];
  selectedCountryNames: string[];
  oecs: boolean;
}

/**
 * Renders the appropriate chart(s) for a question based on its category.
 * Mirrors the Rails dashboard which renders different chart partials per category.
 */
export function QuestionCharts({
  project,
  question,
  selectedYears,
  selectedQuarters,
  selectedCountryNames,
  oecs,
}: QuestionChartsProps) {
  // Build and filter performance data (only submitted data)
  const rawData = buildPerformanceData(project, question);
  const filteredData = filterBySelections(
    rawData,
    selectedYears,
    selectedQuarters,
    selectedCountryNames
  );

  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No data available
      </div>
    );
  }

  switch (question.category) {
    case "country":
      return (
        <div className="space-y-8">
          <CountryColumnChart data={filteredData} oecs={oecs} />
          <TimeSeriesChart
            data={filteredData}
            oecs={oecs}
            groupKey="country"
            title="Time Series by Country"
          />
        </div>
      );

    case "country_gender":
      return (
        <div className="space-y-8">
          <GenderColumnChart data={filteredData} oecs={oecs} />
          <TimeSeriesChart
            data={filteredData}
            oecs={oecs}
            groupKey="country"
            title="Time Series by Country"
          />
        </div>
      );

    case "country_training_gender":
      return (
        <div className="space-y-8">
          <TrainingGenderColumnChart data={filteredData} oecs={oecs} />
          <TimeSeriesChart
            data={filteredData}
            oecs={oecs}
            groupKey="training-gender"
            showTrainingFilter
            showGenderFilter
            title="Time Series by Training & Sex"
          />
          <TimeSeriesChart
            data={filteredData}
            oecs={oecs}
            groupKey="country-training"
            showTrainingFilter
            showGenderFilter
            title="Time Series by Country & Training"
          />
        </div>
      );

    case "country_gender_edrole":
      return (
        <div className="space-y-8">
          <GenderRoleColumnChart data={filteredData} oecs={oecs} />
          <TimeSeriesChart
            data={filteredData}
            oecs={oecs}
            groupKey="gender-role"
            showRoleFilter
            showGenderFilter
            title="Time Series by Sex & Role"
          />
          <TimeSeriesChart
            data={filteredData}
            oecs={oecs}
            groupKey="country-role"
            showRoleFilter
            showGenderFilter
            title="Time Series by Country & Role"
          />
        </div>
      );

    case "country_post":
      return (
        <div className="space-y-8">
          <PostColumnChart data={filteredData} oecs={oecs} />
          <TimeSeriesChart
            data={filteredData}
            oecs={oecs}
            groupKey="country"
            title="Time Series by Country"
          />
        </div>
      );

    case "country_subject":
      return (
        <div className="space-y-8">
          <SubjectColumnChart data={filteredData} oecs={oecs} />
          <TimeSeriesChart
            data={filteredData}
            oecs={oecs}
            groupKey="country"
            title="Time Series by Country"
          />
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          No chart available for this question type
        </div>
      );
  }
}
