-- Enable UUID extension (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS TABLE
-- Supabase Auth handles authentication. This table stores
-- app-specific user data, linked to auth.users via id.
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL DEFAULT '',
  type TEXT DEFAULT 'User',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX index_users_on_email ON users (email);

-- Auto-create a user record when someone signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, type)
  VALUES (NEW.id, NEW.email, 'User')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- REGIONS
-- ============================================================
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COUNTRIES
-- ============================================================
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  short_name TEXT,
  region_id UUID NOT NULL REFERENCES regions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX index_countries_on_region_id ON countries (region_id);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  donor TEXT,
  budget BIGINT,
  approval_date DATE,
  start_date DATE,
  end_date DATE,
  reporting_period INTEGER DEFAULT 0,
  fiscal_year INTEGER DEFAULT 0,
  created_by_id UUID,
  updated_by_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX index_projects_on_created_by_id ON projects (created_by_id);
CREATE INDEX index_projects_on_updated_by_id ON projects (updated_by_id);

-- ============================================================
-- COUNTRIES_PROJECTS (join table)
-- ============================================================
CREATE TABLE countries_projects (
  country_id UUID NOT NULL,
  project_id UUID NOT NULL,
  PRIMARY KEY (country_id, project_id)
);

-- ============================================================
-- COMPONENTS
-- ============================================================
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  objective TEXT,
  outcomes TEXT,
  output TEXT,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX index_components_on_project_id ON components (project_id);

-- ============================================================
-- QUESTIONS
-- ============================================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement TEXT,
  category INTEGER DEFAULT 1,
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  input_type INTEGER DEFAULT 0,
  percentage BOOLEAN DEFAULT FALSE,
  region BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX index_questions_on_component_id ON questions (component_id);

-- ============================================================
-- BASELINES
-- ============================================================
CREATE TABLE baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  country_id UUID REFERENCES countries(id),
  key TEXT,
  value TEXT,
  status INTEGER DEFAULT 0,
  created_by_id UUID,
  updated_by_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX index_baselines_on_question_id ON baselines (question_id);
CREATE INDEX index_baselines_on_country_id ON baselines (country_id);
CREATE INDEX index_baselines_on_created_by_id ON baselines (created_by_id);
CREATE INDEX index_baselines_on_updated_by_id ON baselines (updated_by_id);

-- ============================================================
-- TARGETS
-- ============================================================
CREATE TABLE targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  country_id UUID REFERENCES countries(id),
  year TEXT,
  value TEXT,
  key TEXT,
  status INTEGER DEFAULT 0,
  created_by_id UUID,
  updated_by_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX index_targets_on_question_id ON targets (question_id);
CREATE INDEX index_targets_on_country_id ON targets (country_id);
CREATE INDEX index_targets_on_created_by_id ON targets (created_by_id);
CREATE INDEX index_targets_on_updated_by_id ON targets (updated_by_id);

-- ============================================================
-- PROJECT_RESPONSES
-- ============================================================
CREATE TABLE project_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  report_submission_date TIMESTAMPTZ,
  year INTEGER,
  quarter INTEGER,
  status INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX index_project_responses_on_project_id ON project_responses (project_id);

-- ============================================================
-- PERFORMANCE_INDICATORS
-- ============================================================
CREATE TABLE performance_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_response_id UUID NOT NULL REFERENCES project_responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  country_id UUID REFERENCES countries(id),
  key TEXT,
  value TEXT,
  means_of_verification TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX index_performance_indicators_on_project_response_id ON performance_indicators (project_response_id);
CREATE INDEX index_performance_indicators_on_question_id ON performance_indicators (question_id);
CREATE INDEX index_performance_indicators_on_country_id ON performance_indicators (country_id);

-- ============================================================
-- LOCKS
-- ============================================================
CREATE TABLE locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  year INTEGER,
  quarter INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, question_id, year, quarter)
);

CREATE INDEX index_locks_on_question_id ON locks (question_id);
CREATE INDEX index_locks_on_user_id ON locks (user_id);

-- ============================================================
-- NOTES
-- ============================================================
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX index_notes_on_project_id ON notes (project_id);
CREATE INDEX index_notes_on_user_id ON notes (user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- All authenticated users can read all data.
-- Users can only modify their own locks and notes.
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Read access for all authenticated users
CREATE POLICY "Authenticated users can read all data" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read regions" ON regions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read countries" ON countries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read countries_projects" ON countries_projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read components" ON components FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read questions" ON questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read baselines" ON baselines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read targets" ON targets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read project_responses" ON project_responses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read performance_indicators" ON performance_indicators FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read locks" ON locks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read notes" ON notes FOR SELECT TO authenticated USING (true);

-- Write access for authenticated users (matching original Rails app — no per-project restrictions)
CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage components" ON components FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage questions" ON questions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage baselines" ON baselines FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage targets" ON targets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage project_responses" ON project_responses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage performance_indicators" ON performance_indicators FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage countries_projects" ON countries_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage regions" ON regions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage countries" ON countries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Users can manage their own locks
CREATE POLICY "Users can manage their own locks" ON locks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Users can delete any lock (to handle unlock by others)
CREATE POLICY "Users can view and delete locks" ON locks FOR DELETE TO authenticated USING (true);

-- Users can manage their own notes
CREATE POLICY "Users can insert notes" ON notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON notes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON notes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);
