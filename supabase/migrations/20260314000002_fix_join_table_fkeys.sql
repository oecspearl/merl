-- Add foreign keys to countries_projects join table
-- PostgREST needs these to resolve many-to-many relationships
ALTER TABLE countries_projects
  ADD CONSTRAINT fk_countries_projects_country FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_countries_projects_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
