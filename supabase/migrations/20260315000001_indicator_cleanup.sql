-- ============================================================
-- INDICATOR CLEANUP based on MERL_indicator_organisation.md
-- 1. Add status column to questions
-- 2. Mark removed indicators
-- 3. Remove extra Component 3 questions
-- 4. Fix measurement types
-- ============================================================

-- 1. Add status column (default 'active')
ALTER TABLE questions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

-- 2. Mark removed indicators
-- 1.3.1A: ECE Forum participants (agreed removal — scope overlap)
UPDATE questions SET status = 'removed'
WHERE id = '7afd237b-f7a0-4d4c-b5fc-c560239f522a';

-- 1.3.YC / 1.3.3: Community sensitisation reach (agreed removal — scope overlap)
UPDATE questions SET status = 'removed'
WHERE id = 'e0a070dc-29fd-4246-8281-2f7c16f5a723';

-- 3. Remove extra Component 3 questions (framework stops at 3.1.1C)
-- 3.1.1d: Member states adopted Harmonized Quality Teaching Learning Framework
DELETE FROM baselines WHERE question_id = 'e6489d4b-c31e-4d1f-9078-f2b76f4a12c7';
DELETE FROM targets WHERE question_id = 'e6489d4b-c31e-4d1f-9078-f2b76f4a12c7';
DELETE FROM questions WHERE id = 'e6489d4b-c31e-4d1f-9078-f2b76f4a12c7';

-- 3.1.1e: Principals rated Good to Exceptionally high in leading learning
DELETE FROM baselines WHERE question_id = '16438c4d-6ba6-475e-a42c-df66b7a32531';
DELETE FROM targets WHERE question_id = '16438c4d-6ba6-475e-a42c-df66b7a32531';
DELETE FROM questions WHERE id = '16438c4d-6ba6-475e-a42c-df66b7a32531';

-- 3.1.1f: Principals rated Good to Exceptionally high on institutional strengthening
DELETE FROM baselines WHERE question_id = 'ac32b901-f591-4859-93af-48a2d9b489f2';
DELETE FROM targets WHERE question_id = 'ac32b901-f591-4859-93af-48a2d9b489f2';
DELETE FROM questions WHERE id = 'ac32b901-f591-4859-93af-48a2d9b489f2';

-- 3.1.1g: School leaders reported progress to oversight bodies
DELETE FROM baselines WHERE question_id = '72e4af1c-8cb3-492b-86a8-107005046b4e';
DELETE FROM targets WHERE question_id = '72e4af1c-8cb3-492b-86a8-107005046b4e';
DELETE FROM questions WHERE id = '72e4af1c-8cb3-492b-86a8-107005046b4e';

-- 3.1.3: Research reports approved for publication
DELETE FROM baselines WHERE question_id = 'd837843d-4b34-4a3f-88a9-d0ac55053044';
DELETE FROM targets WHERE question_id = 'd837843d-4b34-4a3f-88a9-d0ac55053044';
DELETE FROM questions WHERE id = 'd837843d-4b34-4a3f-88a9-d0ac55053044';

-- 4. Fix measurement types
-- 3.1.2: SIPs should be binary (not percentage)
UPDATE questions SET input_type = 1, percentage = FALSE
WHERE id = '639ca889-8cc6-4c99-88af-8760b5c76be1';
