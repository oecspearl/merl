"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { AdminModelConfig } from "@/lib/admin-config";

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
      const str = String(value);
      return str.length > 60 ? str.slice(0, 60) + "..." : str;
    }
  }
}

export function AdminTable({
  config,
  data,
  onDelete,
  deleting,
}: AdminTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {config.columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={config.columns.length + 1}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const id = String(row.id ?? "");
                return (
                  <tr key={id} className="hover:bg-gray-50">
                    {config.columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap max-w-xs truncate"
                      >
                        {formatValue(
                          getNestedValue(row, col.key),
                          col.format,
                          col.enumMap
                        )}
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
                              if (
                                confirm(
                                  `Delete this ${config.label.toLowerCase()}?`
                                )
                              ) {
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
