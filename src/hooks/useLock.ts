"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";

type LockState = "unlocked" | "locked" | "unavailable";

interface LockInfo {
  state: LockState;
  lockedByEmail?: string;
}

export function useLock(questionId: string, year: number, quarter: number | null) {
  const { user } = useUser();
  const [lockInfo, setLockInfo] = useState<LockInfo>({ state: "unlocked" });
  const [loading, setLoading] = useState(false);

  // Check current lock state
  const checkLock = useCallback(async () => {
    const supabase = createClient();
    const query = supabase
      .from("locks")
      .select("*, user:users(id, email)")
      .eq("question_id", questionId)
      .eq("year", year);

    if (quarter !== null) {
      query.eq("quarter", quarter);
    }

    const { data } = await query.maybeSingle();

    if (!data) {
      setLockInfo({ state: "unlocked" });
    } else if (data.user_id === user?.id) {
      setLockInfo({ state: "locked" });
    } else {
      setLockInfo({
        state: "unavailable",
        lockedByEmail: (data.user as { email: string })?.email,
      });
    }
  }, [questionId, year, quarter, user?.id]);

  // Check lock on mount (no realtime — avoids WebSocket spam)
  useEffect(() => {
    if (!user) return;
    checkLock();
  }, [user, checkLock]);

  // Toggle lock
  const toggleLock = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const supabase = createClient();

    try {
      if (lockInfo.state === "unlocked") {
        const { error } = await supabase.from("locks").insert({
          user_id: user.id,
          question_id: questionId,
          year,
          quarter,
        });

        if (error) {
          if (error.code === "23505") {
            toast.error("This question is already locked by another user");
          } else {
            toast.error("Failed to acquire lock");
          }
        }
      } else if (lockInfo.state === "locked") {
        const { error } = await supabase
          .from("locks")
          .delete()
          .eq("user_id", user.id)
          .eq("question_id", questionId)
          .eq("year", year);

        if (error) {
          toast.error("Failed to release lock");
        }
      }
    } finally {
      setLoading(false);
      await checkLock();
    }
  }, [user, lockInfo.state, questionId, year, quarter, checkLock]);

  return {
    lockState: lockInfo.state,
    lockedByEmail: lockInfo.lockedByEmail,
    isEditable: lockInfo.state === "locked",
    toggleLock,
    loading,
  };
}
