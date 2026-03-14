"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function AdminUserEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [email, setEmail] = useState("");
  const [type, setType] = useState("User");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error(error.message);
      } else if (data) {
        setEmail(data.email);
        setType(data.type);
      }
      setLoading(false);
    }
    fetch();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({ type })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("User updated!");
      router.push("/admin/users");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (
      !confirm(
        `Delete user "${email}"? This will remove their auth account and all associated data.`
      )
    )
      return;

    setDeleting(true);
    const res = await fetch(`/api/admin/users?id=${id}`, {
      method: "DELETE",
    });
    const result = await res.json();

    if (!res.ok) {
      toast.error(result.error || "Failed to delete user");
      setDeleting(false);
    } else {
      toast.success("User deleted.");
      router.push("/admin/users");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/users")}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit User</h1>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? "Deleting..." : "Delete User"}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed from the admin panel.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="User">User</option>
              <option value="SuperAdmin">SuperAdmin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Update User"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/users")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
