"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  type: "User" | "SuperAdmin";
}

export function useUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const supabase = createClient();

    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("users")
          .select("id, email, type")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }

      setLoading(false);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Only react to sign-in and sign-out, not token refreshes
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setProfile(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, loading, isSuperAdmin: profile?.type === "SuperAdmin" };
}
