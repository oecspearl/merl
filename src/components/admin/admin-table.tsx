"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { AdminModelConfig } from "@/lib/admin-config";

const PAGE_SIZE = 20;

interface AdminTableProps {
  config: AdminModelConfig;
  data: Record<string, unknown>[];
  onDelete?: (id: string) => void;
  deleting?: string | null;
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return null;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function formatValue(
  value: unknown,
  format?: string,
  enumMap?: Record<number | string, string>
): string {
  if (value == null) return "—";

  switch (format) {
    case "date": {
      const d = new Date(value as string);
      if (isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(Number(value));
    case "boolean":
      return value ? "Yes" : "No";
    case "enum":
      if (enumMap) {
        return enumMap[value as number | string] ?? String(value);
      }
      return String(value);
    default: {
      const str = typeof value === "object" ? JSON.stringify(value) : String(value);
      return str.length > 80 ? str.slice(0, 80) + "..." : str;
    }
  }
}

type SortDir = "asc" | "desc" | null;

export function AdminTable({
  config,
  data,
  onDelete,
  deleting,
}: AdminTableProps) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [groupBy, setGroupBy] = useState<string | null>(null);

  // Find groupable columns (nested object columns like "component.title")
  const groupableColumns = config.columns.filter((c) => c.key.includes("."));

  function toggleSort(key: string) {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
      else setSortDir("asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const va = getNestedValue(a, sortKey);
      const vb = getNestedValue(b, sortKey);
      const sa = va == null ? "" : String(va);
      const sb = vb == null ? "" : String(vb);
      const cmp = sa.localeCompare(sb, undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  // Group data if groupBy is set
  const groups = useMemo(() => {
    if (!groupBy) return null;
    const map = new Map<string, Record<string, unknown>[]>();
    for (const row of sorted) {
      const val = String(getNestedValue(row, groupBy) ?? "Ungrouped");
      if (!map.has(val)) map.set(val, []);
      map.get(val)!.push(row);
    }
    return Array.from(map.entries());
  }, [sorted, groupBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = groups ? null : sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function SortIcon({ colKey }: { colKey: string }) {
    if (sortKey !== colKey) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    if (sortDir === "asc") return <ArrowUp className="w-3 h-3 text-purple-600" />;
    return <ArrowDown className="w-3 h-3 text-purple-600" />;
  }

  function renderRows(rows: Record<string, unknown>[]) {
    return rows.map((row) => {
      const id = String(row.id ?? "");
      return (
        <tr key={id} className="hover:bg-gray-50">
          {config.columns.map((col) => (
            <td
              key={col.key}
              className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap max-w-xs truncate"
            >
              {formatValue(getNestedValue(row, col.key), col.format, col.enumMap)}
            </td>
          ))}
          <td className="px-4 py-3 text-right whitespace-nowrap">
            <div className="flex items-center justify-end gap-1">
              {config.canEdit && (
                <Link
                  href={`/admin/${config.slug}/${id}/edit`}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
              )}
              {config.canDelete && onDelete && (
                <button
                  onClick={() => {
                    if (confirm(`Delete this ${config.label.toLowerCase()}?`)) {
                      onDelete(id);
                    }
                  }}
                  disabled={deleting === id}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar: Group By */}
      {groupableColumns.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 bg-gray-50/50">
          <label className="text-xs font-medium text-gray-500 uppercase">Group by</label>
          <select
            value={groupBy ?? ""}
            onChange={(e) => { setGroupBy(e.target.value || null); setPage(1); }}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
          >
            <option value="">None</option>
            {groupableColumns.map((col) => (
              <option key={col.key} value={col.key}>{col.label}</option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {config.columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon colKey={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {groups ? (
              // Grouped view
              groups.map(([groupLabel, rows]) => (
                <GroupSection key={groupLabel}>
                  <tr className="bg-purple-50/60">
                    <td
                      colSpan={config.columns.length + 1}
                      className="px-4 py-2 text-sm font-semibold text-purple-800"
                    >
                      {groupLabel}
                      <span className="ml-2 text-xs font-normal text-purple-500">
                        ({rows.length})
                      </span>
                    </td>
                  </tr>
                  {renderRows(rows)}
                </GroupSection>
              ))
            ) : paged && paged.length === 0 ? (
              <tr>
                <td
                  colSpan={config.columns.length + 1}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              paged && renderRows(paged)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (only when not grouped) */}
      {!groups && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-gray-50">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.length)} of {data.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple fragment wrapper for grouped rows
function GroupSection({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
