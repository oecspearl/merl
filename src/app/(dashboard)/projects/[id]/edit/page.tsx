"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { PageHeading } from "@/components/ui/page-heading";
import { Button } from "@/components/ui/modal";
import { REPORTING_PERIODS, FISCAL_YEARS } from "@/types/constants";
import type { ReportingPeriod, FiscalYear } from "@/types/database";

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  donor: z.string().nullable(),
  budget: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().nullable()
  ),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  approval_date: z.string().nullable(),
  reporting_period: z.enum(["yearly", "quarterly"]),
  fiscal_year: z.enum(["july_to_june", "october_to_september"]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function EditProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: project, isLoading, error } = useProject(id);
  const updateProject = useUpdateProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(projectSchema) as any,
    defaultValues: {
      name: "",
      donor: null,
      budget: null,
      start_date: null,
      end_date: null,
      approval_date: null,
      reporting_period: "yearly",
      fiscal_year: "july_to_june",
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        donor: project.donor,
        budget: project.budget,
        start_date: project.start_date,
        end_date: project.end_date,
        approval_date: project.approval_date,
        reporting_period: project.reporting_period,
        fiscal_year: project.fiscal_year,
      });
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormValues) => {
    await updateProject.mutateAsync({ id, data });
    router.push("/projects");
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading project...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load project: {error.message}
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/projects"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Projects
      </Link>

      <PageHeading title="Edit Project" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Donor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Donor
          </label>
          <input
            type="text"
            {...register("donor")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget
          </label>
          <input
            type="number"
            step="0.01"
            {...register("budget")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            {...register("start_date")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            {...register("end_date")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Approval Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Approval Date
          </label>
          <input
            type="date"
            {...register("approval_date")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Reporting Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reporting Period
          </label>
          <select
            {...register("reporting_period")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {REPORTING_PERIODS.map((rp) => (
              <option key={rp.value} value={rp.value}>
                {rp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fiscal Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fiscal Year
          </label>
          <select
            {...register("fiscal_year")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {FISCAL_YEARS.map((fy) => (
              <option key={fy.value} value={fy.value}>
                {fy.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || updateProject.isPending}
          >
            {updateProject.isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Link href="/projects">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
