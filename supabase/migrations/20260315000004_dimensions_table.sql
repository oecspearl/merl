-- ============================================================
-- DIMENSIONS TABLE
-- Manages disaggregation dimension values (e.g. Sex → Male, Female)
-- Replaces hardcoded constants in the codebase
-- ============================================================

CREATE TABLE IF NOT EXISTS dimensions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  values JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE dimensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read dimensions"
  ON dimensions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage dimensions"
  ON dimensions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed with current hardcoded values
INSERT INTO dimensions (name, label, values) VALUES
  ('sex', 'Sex', '["Male", "Female"]'),
  ('level', 'Level', '["Pre-Primary", "Primary"]'),
  ('training', 'Training', '["ECE", "SEN"]'),
  ('edrole', 'Ed. Role', '["Ed. Officers", "Principals", "Teachers"]'),
  ('post', 'Post', '["Principal", "Dty. Principal", "Other Leaders"]'),
  ('subject', 'Subject', '["Language Arts", "Science", "Social Studies", "Mathematics"]'),
  ('country', 'Country', '["DOM", "GRN", "SLU", "SVG", "ATB", "BVI", "MSR", "SKN", "ANG"]')
ON CONFLICT (name) DO NOTHING;
