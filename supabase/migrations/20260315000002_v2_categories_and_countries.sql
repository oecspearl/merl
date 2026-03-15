-- ============================================================
-- V2 INDICATOR ORGANISATION CHANGES
-- Based on MERL_indicator_organisation_v2.md
-- 1. Add new disaggregation categories (7, 8)
-- 2. Reassign indicators from old categories to new
-- 3. Revert 3.1.2 to quantitative
-- 4. Add non-GPE countries
-- ============================================================

-- ============================================================
-- 1. Reassign indicators to new categories
-- ============================================================

-- Indicators 1.2.1 and 1.2.2: country_training_gender (2) → level_country_edrole_gender (7)
-- These use Level × Country × Ed. Role × Sex disaggregation
UPDATE questions SET category = 7
WHERE id IN (
  '509d9a1e-ce86-4563-aa40-9bcb6c213d81',  -- 1.2.1
  'e1000000-0000-4000-8000-000000000001'   -- 1.2.2
);

-- Indicators 3.1.1A, 3.1.1B, 3.1.1C: country_post (5) → country_post_gender (8)
-- These use Country × Post × Sex disaggregation
UPDATE questions SET category = 8
WHERE id IN (
  'b244ed0b-a8df-4269-b04e-09bb87b08597',  -- 3.1.1A
  '6c7fa5c9-56bf-4ece-b293-e1872ac5bda7',  -- 3.1.1B
  '04a9dd68-5950-47df-8956-be8ea0b99bb6'   -- 3.1.1C
);

-- ============================================================
-- 2. Revert 3.1.2 to quantitative with country disaggregation
-- v2 doc says: Quantitative, country (DOM, GRN, SLU, SVG)
-- We previously set it to binary — undo that
-- ============================================================
UPDATE questions SET input_type = 0, percentage = TRUE, category = 1
WHERE id = '639ca889-8cc6-4c99-88af-8760b5c76be1';

-- ============================================================
-- 3. Add non-GPE countries for expanded scope indicators
-- These countries are needed for indicators 2.1.1B, 2.1.4, 2.1.5, 2.2.1, 2.2.2
-- ============================================================

-- First add the non-GPE countries to the countries table
INSERT INTO countries (id, name, short_name, region_id) VALUES
  ('b0000000-0000-4000-8000-000000000005', 'Antigua and Barbuda', 'ATB', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000006', 'British Virgin Islands', 'BVI', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000007', 'Montserrat', 'MSR', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000008', 'St. Kitts and Nevis', 'SKN', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000009', 'Anguilla', 'ANG', 'a0000000-0000-4000-8000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Link non-GPE countries to the PEARL project for expanded scope
-- The PEARL project ID is c0000000-0000-4000-8000-000000000001
INSERT INTO countries_projects (country_id, project_id) VALUES
  ('b0000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000009', 'c0000000-0000-4000-8000-000000000001')
ON CONFLICT DO NOTHING;
