"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AdminModelConfig, AdminField } from "@/lib/admin-config";
import toast from "react-hot-toast";

interface AdminFormProps {
  config: AdminModelConfig;
  record?: Record<string, unknown> | null;
  mode: "create" | "edit";
}

export function AdminForm({ config, record, mode }: AdminFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [relationOptions, setRelationOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});
  const [saving, setSaving] = useState(false);

  // Initialize form values
  useEffect(() => {
    const initial: Record<string, unknown> = {};
    for (const field of config.fields) {
      if (mode === "edit" && record) {
        let val = record[field.name] ?? field.defaultValue ?? "";
        if (field.storeAsJson && val != null && typeof val === "object") {
          val = JSON.stringify(val);
        }
        initial[field.name] = val;
      } else {
        initial[field.name] = field.defaultValue ?? "";
      }
    }
    setValues(initial);
  }, [config.fields, record, mode]);

  // Fetch relation options
  useEffect(() => {
    async function fetchRelations() {
      const supabase = createClient();
      const relFields = config.fields.filter((f) => f.relation);
      const opts: Record<string, { value: string; label: string }[]> = {};

      for (const field of relFields) {
        const rel = field.relation!;
        const query = rel.selectQuery
          ? supabase.from(rel.table).select(rel.selectQuery)
          : supabase.from(rel.table).select(`${rel.valueField}, ${rel.labelField}`);

        const { data } = await query.order(rel.labelField, {
          ascending: true,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        opts[field.name] = ((data ?? []) as any[]).map((row: Record<string, unknown>) => ({
          value: String(row[rel.valueField]),
          label: String(
            getNestedLabel(row, rel.labelField) ?? row[rel.valueField]
          ),
        }));
      }

      setRelationOptions(opts);
    }

    fetchRelations();
  }, [config.fields]);

  function getNestedLabel(
    obj: Record<string, unknown>,
    field: string
  ): unknown {
    const parts = field.split(".");
    let current: unknown = obj;
    for (const part of parts) {
      if (current == null || typeof current !== "object") return null;
      current = (current as Record<string, unknown>)[part];
    }
    return current;
  }

  function handleChange(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const data: Record<string, unknown> = {};

      for (const field of config.fields) {
        let val = values[field.name];

        if (field.type === "checkbox") {
          val = Boolean(val);
        } else if (field.storeAsJson && val != null && val !== "") {
          try { val = JSON.parse(String(val)); } catch { /* keep as string */ }
        } else if (field.storeAsNumber && val !== "" && val != null) {
          val = parseInt(String(val), 10);
        } else if (field.type === "number" && val !== "" && val != null) {
          val = parseFloat(String(val));
        } else if (field.nullable && (val === "" || val === "null")) {
          val = null;
        } else if (val === "") {
          val = null;
        }

        data[field.name] = val;
      }

      if (mode === "create") {
        const { error } = await supabase.from(config.table).insert(data);
        if (error) throw error;
        toast.success(`${config.label} created!`);
      } else {
        const id = record?.id;
        const { error } = await supabase
          .from(config.table)
          .update(data)
          .eq("id", id);
        if (error) throw error;
        toast.success(`${config.label} updated!`);
      }

      router.push(`/admin/${config.slug}`);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : `Failed to save ${config.label}`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {config.fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={values[field.name]}
          onChange={(val) => handleChange(field.name, val)}
          relationOptions={relationOptions[field.name]}
        />
      ))}

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {saving
            ? "Saving..."
            : mode === "create"
            ? `Create ${config.label}`
            : `Update ${config.label}`}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/${config.slug}`)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

interface FieldInputProps {
  field: AdminField;
  value: unknown;
  onChange: (value: unknown) => void;
  relationOptions?: { value: string; label: string }[];
}

function FieldInput({
  field,
  value,
  onChange,
  relationOptions,
}: FieldInputProps) {
  const baseClass =
    "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white";

  const label = (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {field.label}
      {field.required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  switch (field.type) {
    case "textarea":
      return (
        <div>
          {label}
          <textarea
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            rows={3}
            className={baseClass}
            placeholder={field.placeholder}
          />
        </div>
      );

    case "select": {
      const options = field.relation ? relationOptions ?? [] : field.options ?? [];
      return (
        <div>
          {label}
          <select
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={baseClass}
          >
            <option value="">— Select —</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label className="text-sm font-medium text-gray-700">
            {field.label}
          </label>
        </div>
      );

    default:
      return (
        <div>
          {label}
          <input
            type={field.type}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={baseClass}
            placeholder={field.placeholder}
          />
        </div>
      );
  }
}
