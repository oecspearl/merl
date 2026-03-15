-- ============================================================
-- CATEGORIES TABLE
-- Move from hardcoded integer enums to a managed table
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  dimensions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Authenticated users can read categories"
  ON categories FOR SELECT TO authenticated USING (true);

-- Allow all operations for now (admin-only enforced at app level)
CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed existing categories
INSERT INTO categories (id, name, label, description, dimensions) VALUES
  (0, 'no_level', 'No Level', 'Single value, no disaggregation', '[]'),
  (1, 'country', 'Country', 'One value per country', '["country"]'),
  (2, 'country_training_gender', 'Country Training Sex', 'Country × Training (ECE/SEN) × Sex', '["country", "training", "sex"]'),
  (3, 'country_subject', 'Country Subject', 'Country × Subject', '["country", "subject"]'),
  (4, 'country_gender', 'Country Sex', 'Country × Sex (Male/Female)', '["country", "sex"]'),
  (5, 'country_post', 'Country Post', 'Country × Post (Principal/Dty. Principal)', '["country", "post"]'),
  (6, 'country_gender_edrole', 'Country Sex Edrole (deprecated)', 'Deprecated — use Level Country Edrole Sex instead', '["country", "sex", "edrole"]'),
  (7, 'level_country_edrole_gender', 'Level Country Edrole Sex', 'Level × Country × Ed. Role × Sex', '["level", "country", "edrole", "sex"]'),
  (8, 'country_post_gender', 'Country Post Sex', 'Country × Post × Sex', '["country", "post", "sex"]')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to next value
SELECT setval('categories_id_seq', (SELECT MAX(id) + 1 FROM categories));

-- Add foreign key from questions.category → categories.id
-- This makes the integer category column a proper FK
ALTER TABLE questions
  ADD CONSTRAINT questions_category_fkey
  FOREIGN KEY (category) REFERENCES categories(id) ON DELETE SET NULL;
