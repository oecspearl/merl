"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/projects/project-card";
import { PageHeading } from "@/components/ui/page-heading";

export default function ProjectsPage() {
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div>
      <PageHeading
        title="Projects"
        description="Track, manage and forecast your goals."
      />

      {isLoading && (
        <div className="text-center py-12 text-gray-500">Loading projects...</div>
      )}

      {error && (
        <div className="text-center py-12 text-red-500">
          Failed to load projects: {error.message}
        </div>
      )}

      {projects && projects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No projects found. Create one in the admin panel.
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
