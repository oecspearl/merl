"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileDown } from "lucide-react";

export default function ExportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function triggerExport() {
      try {
        const response = await fetch(`/api/export/${id}`);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Failed to generate export.");
        }

        const blob = await response.blob();

        if (blob.size === 0) {
          setStatus("error");
          setErrorMessage("No data available for export.");
          return;
        }

        // Extract filename from Content-Disposition header, fallback to default
        const disposition = response.headers.get("Content-Disposition");
        let filename = `project-${id}-export.xlsx`;
        if (disposition) {
          const match = disposition.match(/filename="?(.+?)"?$/);
          if (match?.[1]) filename = match[1];
        }

        // Trigger file download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Redirect back to projects
        router.push("/projects");
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      }
    }

    triggerExport();
  }, [id, router]);

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="p-3 bg-red-50 rounded-full">
          <FileDown className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
        <button
          onClick={() => router.push(`/projects/${id}`)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Project
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      <p className="text-sm text-gray-500">Generating export...</p>
    </div>
  );
}
