"use client";

import { Lock, Unlock, Loader2 } from "lucide-react";
import { useLock } from "@/hooks/useLock";
import { cn } from "@/lib/utils";

interface LockToggleProps {
  questionId: string;
  year: number;
  quarter: number | null;
}

export function LockToggle({ questionId, year, quarter }: LockToggleProps) {
  const { lockState, lockedByEmail, toggleLock, loading } = useLock(
    questionId,
    year,
    quarter
  );

  return (
    <button
      onClick={toggleLock}
      disabled={loading || lockState === "unavailable"}
      title={
        lockState === "locked"
          ? "Click to unlock (saves your changes)"
          : lockState === "unavailable"
          ? `Locked by ${lockedByEmail}`
          : "Click to lock for editing"
      }
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
        lockState === "locked" && "bg-green-100 text-green-700 hover:bg-green-200",
        lockState === "unlocked" && "bg-blue-100 text-blue-700 hover:bg-blue-200",
        lockState === "unavailable" && "bg-gray-100 text-gray-400 cursor-not-allowed"
      )}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : lockState === "locked" ? (
        <Lock className="w-3 h-3" />
      ) : (
        <Unlock className="w-3 h-3" />
      )}
      {lockState === "locked"
        ? "Locked by you"
        : lockState === "unavailable"
        ? `Locked by ${lockedByEmail?.split("@")[0] || "other"}`
        : "Unlocked"}
    </button>
  );
}
