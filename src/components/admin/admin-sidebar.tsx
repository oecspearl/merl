"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Puzzle,
  HelpCircle,
  Globe,
  MapPin,
  Link2,
  Target,
  Crosshair,
  FileBarChart,
  Users,
  StickyNote,
  Lock,
  Upload,
} from "lucide-react";
import { ADMIN_MODELS, ADMIN_GROUPS } from "@/lib/admin-config";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  projects: FolderKanban,
  components: Puzzle,
  questions: HelpCircle,
  regions: MapPin,
  countries: Globe,
  "countries-projects": Link2,
  baselines: Crosshair,
  targets: Target,
  "project-responses": FileBarChart,
  users: Users,
  notes: StickyNote,
  locks: Lock,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)] flex-shrink-0">
      <div className="p-4">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-4",
            pathname === "/admin"
              ? "bg-purple-50 text-purple-700"
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>

        {ADMIN_GROUPS.map((group) => {
          const models = ADMIN_MODELS.filter((m) => m.group === group.key);
          if (models.length === 0) return null;
          return (
            <div key={group.key} className="mb-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {group.label}
              </p>
              {models.map((model) => {
                const Icon = ICONS[model.slug] ?? FolderKanban;
                const isActive = pathname.startsWith(`/admin/${model.slug}`);
                return (
                  <Link
                    key={model.slug}
                    href={`/admin/${model.slug}`}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {model.labelPlural}
                  </Link>
                );
              })}
            </div>
          );
        })}

        {/* User Imports link */}
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Tools
          </p>
          <Link
            href="/admin/user-imports"
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
              pathname === "/admin/user-imports"
                ? "bg-purple-50 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Upload className="w-3.5 h-3.5" />
            User Imports
          </Link>
        </div>
      </div>
    </aside>
  );
}
