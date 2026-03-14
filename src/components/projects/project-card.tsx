"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Pencil, Target, FileSpreadsheet, FileText } from "lucide-react";
import { DropdownMenu, DropdownItem } from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate, titleize } from "@/lib/utils";
import type { Project } from "@/types/database";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4 border-b border-gray-200 pb-3">
        <Link
          href={`/projects/${project.id}`}
          className="text-base font-semibold text-purple-700 hover:text-purple-900 transition-colors"
        >
          {project.name}
        </Link>
        <DropdownMenu>
          <DropdownItem onClick={() => router.push(`/projects/${project.id}/dashboard`)}>
            <BarChart3 className="w-4 h-4" />
            View Dashboard
          </DropdownItem>
          <DropdownItem onClick={() => router.push(`/projects/${project.id}/reports`)}>
            <FileText className="w-4 h-4" />
            View Reports
          </DropdownItem>
          <DropdownItem onClick={() => router.push(`/projects/${project.id}/edit`)}>
            <Pencil className="w-4 h-4" />
            Edit Project
          </DropdownItem>
          <DropdownItem onClick={() => router.push(`/projects/${project.id}/baselines`)}>
            <Target className="w-4 h-4" />
            Edit Baseline
          </DropdownItem>
          <DropdownItem onClick={() => router.push(`/projects/${project.id}/targets`)}>
            <Target className="w-4 h-4" />
            Edit Targets
          </DropdownItem>
          <DropdownItem onClick={() => router.push(`/projects/${project.id}/export`)}>
            <FileSpreadsheet className="w-4 h-4" />
            Export Data
          </DropdownItem>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-y-3 text-sm">
        <Field label="Donor" value={project.donor} />
        <Field label="Budget" value={formatCurrency(project.budget)} />
        <Field label="Start Date" value={formatDate(project.start_date)} />
        <Field label="Expected Close Date" value={formatDate(project.end_date)} />
        <Field label="Approval Date" value={formatDate(project.approval_date)} />
        <Field label="Reporting Period" value={project.reporting_period ? titleize(project.reporting_period) : "—"} />
        <Field label="Fiscal Year" value={project.fiscal_year ? titleize(project.fiscal_year) : "—"} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex gap-4">
      <p className="font-semibold text-gray-700 min-w-[140px]">{label}</p>
      <p className="text-gray-900">{value || "—"}</p>
    </div>
  );
}
