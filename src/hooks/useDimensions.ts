"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export type DimensionMap = Record<string, string[]>;

async function fetchDimensions(): Promise<DimensionMap> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("dimensions")
    .select("name, values")
    .order("name");

  if (error) throw error;

  const map: DimensionMap = {};
  for (const row of data ?? []) {
    map[row.name] = (row.values as string[]) ?? [];
  }
  return map;
}

export function useDimensions() {
  return useQuery({
    queryKey: ["dimensions"],
    queryFn: fetchDimensions,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
}
