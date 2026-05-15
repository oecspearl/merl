-- ============================================================
-- V3 CATEGORY / DIMENSION CHANGES
-- 1. Add new dimensions: grade, form
-- 2. Update level dimension to include "Secondary"
-- 3. Replace subject dimension values with [Literacy, Numeracy]
-- 4. Add new categories:
--      9  country_level_gender
--     10  country_grade_gender
--     11  country_form_gender
--     12  country_level
--     13  country_level_subject_gender
-- 5. Delete deprecated category 6 (country_gender_edrole).
--    Existing FK uses ON DELETE SET NULL so questions still pointing
--    at it become category=NULL (i.e. "no_level" fallback).
-- ============================================================

-- 1. New dimensions
INSERT INTO dimensions (name, label, values) VALUES
  ('grade', 'Grade',
   '["K", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]'),
  ('form', 'Form',
   '["Form 1", "Form 2", "Form 3", "Form 4", "Form 5"]')
ON CONFLICT (name) DO UPDATE
  SET values = EXCLUDED.values, label = EXCLUDED.label;

-- 2. Level dimension — add Secondary
UPDATE dimensions
   SET values = '["Pre-Primary", "Primary", "Secondary"]'
 WHERE name = 'level';

-- 3. Subject dimension — replace with Literacy / Numeracy
UPDATE dimensions
   SET values = '["Literacy", "Numeracy"]'
 WHERE name = 'subject';

-- 4. New categories
INSERT INTO categories (id, name, label, description, dimensions) VALUES
  (9,  'country_level_gender',         'Country Level Sex',
       'Country × Level × Sex',                       '["country", "level", "sex"]'),
  (10, 'country_grade_gender',         'Country Grade Sex',
       'Country × Grade (K, 1-6) × Sex',              '["country", "grade", "sex"]'),
  (11, 'country_form_gender',          'Country Form Sex',
       'Country × Form (1-5) × Sex',                  '["country", "form", "sex"]'),
  (12, 'country_level',                'Country Level',
       'Country × Level (no Sex)',                    '["country", "level"]'),
  (13, 'country_level_subject_gender', 'Country Level Subject Sex',
       'Country × Level × Subject (Literacy/Numeracy) × Sex',
       '["country", "level", "subject", "sex"]')
ON CONFLICT (id) DO NOTHING;

-- Keep sequence in sync
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 5. Drop deprecated category. ON DELETE SET NULL on questions.category
--    handles any orphan references.
DELETE FROM categories WHERE id = 6;
