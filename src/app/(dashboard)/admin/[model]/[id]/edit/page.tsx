"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getModelConfig } from "@/lib/admin-config";
import { AdminForm } from "@/components/admin/admin-form";
import toast from "react-hot-toast";

export default function AdminModelEditPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.model as string;
  const id = params.id as string;
  const config = getModelConfig(slug);

  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!config) return;
    async function fetch() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(config!.table)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error(error.message);
      } else {
        setRecord(data);
      }
      setLoading(false);
    }
    fetch();
  }, [config, id]);

  async function handleDelete() {
    if (!config || !confirm(`Delete this ${config.label.toLowerCase()}?`))
      return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from(config.table)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      setDeleting(false);
    } else {
      toast.success(`${config.label} deleted.`);
      router.push(`/admin/${slug}`);
    }
  }

  if (!config) {
    return (
      <div className="p-6 text-center text-gray-500">
        Model &quot;{slug}&quot; not found.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-6 text-center text-gray-500">Record not found.</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/admin/${slug}`)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Edit {config.label}
            </h1>
            <p className="text-sm text-gray-500">
              {String(
                record[config.labelField] ?? record.id ?? ""
              ).slice(0, 80)}
            </p>
          </div>
        </div>

        {config.canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <AdminForm config={config} record={record} mode="edit" />
      </div>
    </div>
  );
}
