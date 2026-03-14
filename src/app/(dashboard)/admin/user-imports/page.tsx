"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { PageHeading } from "@/components/ui/page-heading";
import toast from "react-hot-toast";

interface ImportResult {
  created: number;
  updated: number;
  failed: number;
  errors: string[];
}

export default function UserImportsPage() {
  const router = useRouter();
  const { profile, loading: userLoading, isSuperAdmin } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  // Redirect non-super-admins
  if (!userLoading && !isSuperAdmin) {
    router.push("/projects");
    return null;
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  async function handleUpload() {
    if (!file) {
      toast.error("Please select a CSV file.");
      return;
    }

    setImporting(true);
    setResult(null);

    const importResult: ImportResult = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };

    try {
      const text = await file.text();
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length < 2) {
        toast.error("CSV file must have a header row and at least one data row.");
        setImporting(false);
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const emailIndex = headers.indexOf("email");
      const typeIndex = headers.indexOf("type");

      if (emailIndex === -1) {
        toast.error('CSV must have an "email" column.');
        setImporting(false);
        return;
      }

      const supabase = createClient();

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim());
        const email = cols[emailIndex];
        const userType = typeIndex !== -1 ? cols[typeIndex] : "User";

        if (!email) {
          importResult.failed++;
          importResult.errors.push(`Row ${i + 1}: Missing email.`);
          continue;
        }

        try {
          // Check if user exists
          const { data: existing } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle();

          if (existing) {
            // Update existing user
            const { error } = await supabase
              .from("users")
              .update({
                type: userType === "SuperAdmin" ? "SuperAdmin" : "User",
              })
              .eq("id", existing.id);

            if (error) {
              importResult.failed++;
              importResult.errors.push(`Row ${i + 1} (${email}): ${error.message}`);
            } else {
              importResult.updated++;
            }
          } else {
            // Create new user
            const { error } = await supabase.from("users").insert({
              email,
              type: userType === "SuperAdmin" ? "SuperAdmin" : "User",
            });

            if (error) {
              importResult.failed++;
              importResult.errors.push(`Row ${i + 1} (${email}): ${error.message}`);
            } else {
              importResult.created++;
            }
          }
        } catch (err) {
          importResult.failed++;
          importResult.errors.push(
            `Row ${i + 1} (${email}): ${err instanceof Error ? err.message : "Unknown error"}`
          );
        }
      }

      setResult(importResult);

      if (importResult.failed === 0) {
        toast.success("Import completed successfully!");
      } else {
        toast("Import completed with some errors.", { icon: "!" });
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to process CSV file."
      );
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeading
        title="Import Users"
        description="Upload a CSV file to create or update user accounts in bulk."
      />

      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CSV File
            </label>
            <p className="text-xs text-gray-500 mb-3">
              The CSV file should include an &quot;email&quot; column and
              optionally a &quot;type&quot; column (User or SuperAdmin).
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={importing || !file}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-4 h-4" />
            {importing ? "Importing..." : "Upload & Import"}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Import Results
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700">
                {result.created}
              </p>
              <p className="text-xs text-green-600 mt-1">Created</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">
                {result.updated}
              </p>
              <p className="text-xs text-blue-600 mt-1">Updated</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-700">
                {result.failed}
              </p>
              <p className="text-xs text-red-600 mt-1">Failed</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2">Errors</h4>
              <ul className="space-y-1 max-h-48 overflow-y-auto">
                {result.errors.map((error, i) => (
                  <li key={i} className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
