"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Puzzle,
  HelpCircle,
  Globe,
  Users,
  FileBarChart,
  Target,
  Crosshair,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ModelCount {
  slug: string;
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
}

const MODELS_TO_COUNT: {
  slug: string;
  label: string;
  table: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    slug: "projects",
    label: "Projects",
    table: "projects",
    icon: FolderKanban,
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    slug: "components",
    label: "Components",
    table: "components",
    icon: Puzzle,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    slug: "questions",
    label: "Questions",
    table: "questions",
    icon: HelpCircle,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
  },
  {
    slug: "categories",
    label: "Categories",
    table: "categories",
    icon: LayoutGrid,
    color: "bg-teal-50 text-teal-600 border-teal-200",
  },
  {
    slug: "dimensions",
    label: "Dimensions",
    table: "dimensions",
    icon: SlidersHorizontal,
    color: "bg-violet-50 text-violet-600 border-violet-200",
  },
  {
    slug: "countries",
    label: "Countries",
    table: "countries",
    icon: Globe,
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    slug: "users",
    label: "Users",
    table: "users",
    icon: Users,
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    slug: "baselines",
    label: "Baselines",
    table: "baselines",
    icon: Crosshair,
    color: "bg-cyan-50 text-cyan-600 border-cyan-200",
  },
  {
    slug: "targets",
    label: "Targets",
    table: "targets",
    icon: Target,
    color: "bg-pink-50 text-pink-600 border-pink-200",
  },
  {
    slug: "project-responses",
    label: "Responses",
    table: "project_responses",
    icon: FileBarChart,
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<ModelCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      const supabase = createClient();
      const results: ModelCount[] = [];

      for (const model of MODELS_TO_COUNT) {
        const { count } = await supabase
          .from(model.table)
          .select("*", { count: "exact", head: true });
        results.push({
          slug: model.slug,
          label: model.label,
          count: count ?? 0,
          icon: model.icon,
          color: model.color,
        });
      }

      setCounts(results);
      setLoading(false);
    }

    fetchCounts();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all data in the OECS MERL Reporting platform.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {counts.map((model) => {
            const Icon = model.icon;
            return (
              <Link
                key={model.slug}
                href={`/admin/${model.slug}`}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${model.color}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-8 h-8" />
                  <div>
                    <p className="text-2xl font-bold">{model.count}</p>
                    <p className="text-xs font-medium">{model.label}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
