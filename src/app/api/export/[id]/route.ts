import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getDataPoints, getProjectYears, normalizeProject } from "@/lib/utils";
import type { QuestionCategory } from "@/types/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch project with all nested data
  const { data: project, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      countries_projects (
        country:countries (*, region:regions(*))
      ),
      components (
        *,
        questions (
          *,
          baselines (*),
          targets (*)
        )
      ),
      project_responses (
        *,
        performance_indicators (*)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Normalize integer enums to string values
  const normalized = normalizeProject(project);

  // Flatten the join table result into a countries array
  const countries = (
    (normalized.countries_projects as Array<{ country: Record<string, unknown> }>) ?? []
  ).map((cp) => cp.country) as Array<{ id: string; name: string; short_name: string; region_id: string }>;

  if (!normalized.project_responses || normalized.project_responses.length === 0) {
    return NextResponse.json(
      { error: "No data to export" },
      { status: 400 }
    );
  }

  const workbook = XLSX.utils.book_new();
  const years = getProjectYears(normalized.start_date, normalized.end_date);
  const quarters = normalized.reporting_period === "quarterly" ? [1, 2, 3, 4] : [null];

  for (const year of years) {
    for (const quarter of quarters) {
      const sheetName = quarter
        ? `${year} Q${quarter}`
        : `${year}`;

      const rows: Record<string, string | number>[] = [];

      const projectResponse = normalized.project_responses?.find(
        (pr: { year: number; quarter: number | null }) =>
          pr.year === year && pr.quarter === quarter
      );

      for (const component of normalized.components || []) {
        for (const question of component.questions || []) {
          const dataPoints = getDataPoints(question.category as QuestionCategory);

          for (const country of countries) {
            const baseline = question.baselines?.find(
              (b: { country_id: string | null }) => b.country_id === country.id
            );
            const target = question.targets?.find(
              (t: { country_id: string | null; year: string }) =>
                t.country_id === country.id && t.year === String(year)
            );
            const indicator = projectResponse?.performance_indicators?.find(
              (pi: { country_id: string | null; question_id: string }) =>
                pi.country_id === country.id && pi.question_id === question.id
            );

            const row: Record<string, string | number> = {
              Component: component.title,
              Question: question.statement || "",
              Country: country.name,
            };

            // Add data point columns
            for (const dp of dataPoints) {
              if (dp !== "Country") {
                row[dp] = "";
              }
            }

            row["Baseline"] = baseline?.value || "";
            row["Target"] = target?.value || "";
            row["Current Progress"] = indicator?.value || "";
            row["Means of Verification"] = indicator?.means_of_verification || "";

            rows.push(row);
          }
        }
      }

      if (rows.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
      }
    }
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="Report_OECS_${normalized.name}.xlsx"`,
    },
  });
}
