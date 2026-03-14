"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getModelConfig } from "@/lib/admin-config";
import { AdminTable } from "@/components/admin/admin-table";
import toast from "react-hot-toast";

export default function AdminModelListPage() {
  const params = useParams();
  const slug = params.model as string;
  const config = getModelConfig(slug);

  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!config) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function fetchData() {
    if (!config) return;
    setLoading(true);
    const supabase = createClient();
    const { data: records, error } = await supabase
      .from(config.table)
      .select(config.selectQuery)
      .order(config.orderBy.column, { ascending: config.orderBy.ascending })
      .limit(500);

    if (error) {
      toast.error(error.message);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setData((records as any) ?? []);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!config) return;
    setDeleting(id);
    const supabase = createClient();
    const { error } = await supabase
      .from(config.table)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${config.label} deleted.`);
      setData((prev) => prev.filter((r) => r.id !== id));
    }
    setDeleting(null);
  }

  if (!config) {
    return (
      <div className="p-6 text-center text-gray-500">
        Model &quot;{slug}&quot; not found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {config.labelPlural}
          </h1>
          <p className="text-sm text-gray-500">
            {data.length} record{data.length !== 1 ? "s" : ""}
          </p>
        </div>
        {config.canCreate && (
          <Link
            href={`/admin/${config.slug}/new`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New {config.label}
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      ) : (
        <AdminTable
          config={config}
          data={data}
          onDelete={config.canDelete ? handleDelete : undefined}
          deleting={deleting}
        />
      )}
    </div>
  );
}
