"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { getUsernameFromEmail, formatDate } from "@/lib/utils";
import type { Note } from "@/types/database";
import toast from "react-hot-toast";

interface NotesDrawerProps {
  projectId: string;
  notes: Note[];
}

export function NotesDrawer({ projectId, notes }: NotesDrawerProps) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient();

  async function handleSave() {
    if (!description.trim() || !user) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("notes").insert({
        description: description.trim(),
        user_id: user.id,
        project_id: projectId,
      });

      if (error) throw error;

      toast.success("Note added!");
      setDescription("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Notes
        {notes.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
            {notes.length}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 min-w-[360px] bg-white shadow-xl z-40 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-65px)]">
          {showForm ? (
            /* Note Form */
            <div className="flex flex-col flex-1 p-6">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Add a Note
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your note here..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              />
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setDescription("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !description.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Notes List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {notes.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No notes yet. Add one below.
                  </p>
                ) : (
                  notes.map((note, index) => (
                    <div
                      key={note.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-purple-600">
                          #{index + 1}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(note.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {note.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {note.user?.email
                          ? getUsernameFromEmail(note.user.email)
                          : "Unknown"}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Button */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Note
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
