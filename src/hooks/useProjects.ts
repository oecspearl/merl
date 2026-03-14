"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Project, Baseline, Target, PerformanceIndicator, ProjectResponse } from "@/types/database";
import { normalizeProject } from "@/lib/utils";
import toast from "react-hot-toast";

// Fetch all projects with components and questions
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          countries_projects (
            country:countries (*)
          ),
          components (
            *,
            questions (
              *,
              baselines (*),
              targets (*)
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Normalize integer enums and flatten the join table result
      return (data ?? []).map((p: Record<string, unknown>) => {
        const normalized = normalizeProject(p);
        return {
          ...normalized,
          countries: ((normalized.countries_projects as Array<{ country: unknown }>) ?? []).map(
            (cp: { country: unknown }) => cp.country
          ),
        };
      }) as Project[];
    },
    retry: 2,
  });
}

// Fetch single project with all nested data
export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          countries_projects (
            country:countries (*, region:regions(*))
          ),
          components (
            *,
            questions (
              *,
              baselines (*),
              targets (*),
              locks (*, user:users(id, email))
            )
          ),
          project_responses (
            *,
            performance_indicators (*)
          ),
          notes (*, user:users(id, email))
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Normalize integer enums and flatten the join table result
      const normalized = normalizeProject(data);
      return {
        ...normalized,
        countries: ((normalized.countries_projects as Array<{ country: unknown }>) ?? []).map(
          (cp: { country: unknown }) => cp.country
        ),
      } as Project;
    },
    enabled: !!id,
    retry: 2,
  });
}

// Update project
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Project>;
    }) => {
      const supabase = createClient();
      const { error } = await supabase.from("projects").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      toast.success("Project Updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Save baselines
export function useSaveBaselines() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      baselines,
    }: {
      projectId: string;
      baselines: Array<{
        question_id: string;
        country_id: string | null;
        key: string | null;
        value: string | null;
        status: "draft" | "submitted";
      }>;
    }) => {
      const supabase = createClient();
      for (const baseline of baselines) {
        const { data: existing } = await supabase
          .from("baselines")
          .select("id")
          .eq("question_id", baseline.question_id)
          .is("country_id", baseline.country_id)
          .is("key", baseline.key)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("baselines")
            .update({ value: baseline.value, status: baseline.status })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("baselines").insert(baseline);
          if (error) throw error;
        }
      }
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      toast.success("Baselines Updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Save targets
export function useSaveTargets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      targets,
    }: {
      projectId: string;
      targets: Array<{
        question_id: string;
        country_id: string | null;
        key: string | null;
        year: string;
        value: string | null;
        status: "draft" | "submitted";
      }>;
    }) => {
      const supabase = createClient();
      for (const target of targets) {
        const { data: existing } = await supabase
          .from("targets")
          .select("id")
          .eq("question_id", target.question_id)
          .eq("year", target.year)
          .is("country_id", target.country_id)
          .is("key", target.key)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("targets")
            .update({ value: target.value, status: target.status })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("targets").insert(target);
          if (error) throw error;
        }
      }
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      toast.success("Targets Updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Save performance indicators
export function useSavePerformanceIndicators() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      year,
      quarter,
      status,
      indicators,
    }: {
      projectId: string;
      year: number;
      quarter: number | null;
      status: "draft" | "submitted";
      indicators: Array<{
        question_id: string;
        country_id: string | null;
        key: string | null;
        value: string | null;
        means_of_verification: string | null;
      }>;
    }) => {
      const supabase = createClient();

      // Find or create project response
      let { data: projectResponse } = await supabase
        .from("project_responses")
        .select("id")
        .eq("project_id", projectId)
        .eq("year", year)
        .eq("quarter", quarter)
        .maybeSingle();

      if (!projectResponse) {
        const { data, error } = await supabase
          .from("project_responses")
          .insert({ project_id: projectId, year, quarter, status })
          .select("id")
          .single();
        if (error) throw error;
        projectResponse = data;
      }

      // Upsert each indicator
      for (const indicator of indicators) {
        const { data: existing } = await supabase
          .from("performance_indicators")
          .select("id")
          .eq("project_response_id", projectResponse.id)
          .eq("question_id", indicator.question_id)
          .is("country_id", indicator.country_id)
          .is("key", indicator.key)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("performance_indicators")
            .update({
              value: indicator.value,
              means_of_verification: indicator.means_of_verification,
            })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("performance_indicators")
            .insert({
              ...indicator,
              project_response_id: projectResponse.id,
            });
          if (error) throw error;
        }
      }

      // Update project response status
      await supabase
        .from("project_responses")
        .update({ status })
        .eq("id", projectResponse.id);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      toast.success("Performance Indicators Updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
