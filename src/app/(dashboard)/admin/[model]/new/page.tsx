"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getModelConfig } from "@/lib/admin-config";
import { AdminForm } from "@/components/admin/admin-form";

export default function AdminModelNewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.model as string;
  const config = getModelConfig(slug);

  if (!config) {
    return (
      <div className="p-6 text-center text-gray-500">
        Model &quot;{slug}&quot; not found.
      </div>
    );
  }

  if (!config.canCreate) {
    router.push(`/admin/${slug}`);
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push(`/admin/${slug}`)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            New {config.label}
          </h1>
          <p className="text-sm text-gray-500">
            Create a new {config.label.toLowerCase()} record.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <AdminForm config={config} mode="create" />
      </div>
    </div>
  );
}
