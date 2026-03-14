-- ============================================================
-- Fix PEARL project with correct data
-- ============================================================
UPDATE projects
SET
  donor = 'Global Partnership for Education',
  budget = 10000000,
  approval_date = '2020-11-30',
  start_date = '2021-07-01',
  end_date = '2026-06-30',
  reporting_period = 0,
  fiscal_year = 0
WHERE id = 'c0000000-0000-4000-8000-000000000001';

-- ============================================================
-- Add OESS Harmonised Indicators project
-- ============================================================
INSERT INTO projects (id, name, donor, budget, approval_date, start_date, end_date, reporting_period, fiscal_year)
VALUES (
  'c0000000-0000-4000-8000-000000000002',
  'OESS Harmonised Indicators',
  'OECS',
  0,
  '2025-09-10',
  '2023-09-01',
  '2029-09-30',
  0,  -- yearly
  0   -- july_to_june
);

-- Link OESS project to all 4 countries
INSERT INTO countries_projects (country_id, project_id) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002'),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000002'),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000002'),
  ('b0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000002');
