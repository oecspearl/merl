-- Add created_by_id and updated_by_id to projects, baselines, and targets
-- Matches Rails schema audit trail columns

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS created_by_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE baselines
  ADD COLUMN IF NOT EXISTS created_by_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE targets
  ADD COLUMN IF NOT EXISTS created_by_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_by ON projects(updated_by_id);
CREATE INDEX IF NOT EXISTS idx_baselines_created_by ON baselines(created_by_id);
CREATE INDEX IF NOT EXISTS idx_baselines_updated_by ON baselines(updated_by_id);
CREATE INDEX IF NOT EXISTS idx_targets_created_by ON targets(created_by_id);
CREATE INDEX IF NOT EXISTS idx_targets_updated_by ON targets(updated_by_id);

-- Auto-set created_by_id and updated_by_id via trigger
CREATE OR REPLACE FUNCTION set_audit_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by_id := COALESCE(NEW.created_by_id, auth.uid());
    NEW.updated_by_id := COALESCE(NEW.updated_by_id, auth.uid());
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by_id := COALESCE(auth.uid(), NEW.updated_by_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to all three tables
CREATE TRIGGER set_projects_audit
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER set_baselines_audit
  BEFORE INSERT OR UPDATE ON baselines
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER set_targets_audit
  BEFORE INSERT OR UPDATE ON targets
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();
