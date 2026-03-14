-- ============================================================
-- SEED DATA
-- Mirrors db/seeds/01_countries.rb and db/seeds/02_components.rb
-- from the Rails OECS Reporting app.
-- ============================================================

-- ============================================================
-- REGION
-- ============================================================
INSERT INTO regions (id, name) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'OECS');

-- ============================================================
-- COUNTRIES
-- ============================================================
INSERT INTO countries (id, name, short_name, region_id) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'Dominica',     'DOM', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000002', 'Grenada',      'GRN', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000003', 'St. Lucia',    'SLU', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000004', 'St. Vincent',  'SVG', 'a0000000-0000-4000-8000-000000000001');

-- ============================================================
-- PROJECT: OECS PEARL Results Framework
-- ============================================================
INSERT INTO projects (id, name, donor, budget, approval_date, start_date, end_date) VALUES
  ('c0000000-0000-4000-8000-000000000001',
   'OECS PEARL Results Framework',
   'Whizzbridge',
   10000,
   CURRENT_DATE,
   '2021-07-01',
   '2025-06-30');

-- ============================================================
-- COUNTRIES_PROJECTS (associate all countries with the project)
-- ============================================================
INSERT INTO countries_projects (country_id, project_id) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000001');

-- ============================================================
-- COMPONENTS & QUESTIONS
--
-- Rails enum mappings (integer values stored in DB):
--   category:   no_level=0, country=1, country_training_gender=2,
--               country_subject=3, country_gender=4, country_post=5,
--               country_gender_edrole=6
--   input_type: number=0, boolean=1
-- ============================================================

-- Component 1
INSERT INTO components (id, title, objective, project_id) VALUES
  ('d0000000-0000-4000-8000-000000000001',
   'Component 1: Enhanced quality and equity of access to ECDs and Special Education Needs (SEN) Services',
   'Enhanced Quality and Equity of Access to Early Childhood Education and Special Education Needs',
   'c0000000-0000-4000-8000-000000000001');

INSERT INTO questions (statement, category, input_type, percentage, component_id) VALUES
  ('1.1 How many pre-primary classrooms have been established and equipped according to minimum standards?',
   1, 0, FALSE, 'd0000000-0000-4000-8000-000000000001'),
  ('1.2 How many pre-primary and primary administrators have been trained to support in-service child-centered leaders in the country?',
   2, 0, FALSE, 'd0000000-0000-4000-8000-000000000001'),
  ('1.3 How many participants in total attended the ECE Forum?',
   1, 0, FALSE, 'd0000000-0000-4000-8000-000000000001'),
  ('1.4 Is the National Child Disability & SEN Survey completed?',
   1, 1, FALSE, 'd0000000-0000-4000-8000-000000000001'),
  ('1.5 How many persons were reached annually through social media, TV, and/or radio?',
   4, 0, FALSE, 'd0000000-0000-4000-8000-000000000001');

-- Component 2
INSERT INTO components (id, title, objective, project_id) VALUES
  ('d0000000-0000-4000-8000-000000000002',
   'Component 2: Enhanced Curriculum & Assessment',
   'Enhanced Curriculum and Assessment',
   'c0000000-0000-4000-8000-000000000001');

INSERT INTO questions (statement, category, input_type, percentage, component_id) VALUES
  ('2.1 How many classroom observations were completed?',
   1, 0, TRUE, 'd0000000-0000-4000-8000-000000000002'),
  ('2.2 How many primary teachers used formative assessments based on learning standards?',
   1, 0, TRUE, 'd0000000-0000-4000-8000-000000000002'),
  ('2.3 How many successful OHPC pilots were conducted?',
   3, 0, FALSE, 'd0000000-0000-4000-8000-000000000002'),
  ('2.4 How many Ministry of Education Officials were certified in curriculum and assessment?',
   1, 0, FALSE, 'd0000000-0000-4000-8000-000000000002'),
  ('2.5 How many member states incorporated the standardized grade 2 reading assessment into national assessments?',
   1, 0, TRUE, 'd0000000-0000-4000-8000-000000000002'),
  ('2.6 How many member states incorporated the standardized grade 2 numeracy assessment into national assessments?',
   1, 0, TRUE, 'd0000000-0000-4000-8000-000000000002');

-- Component 3
INSERT INTO components (id, title, objective, project_id) VALUES
  ('d0000000-0000-4000-8000-000000000003',
   'Component 3: Strengthened Leadership and Management',
   'To enhance educational leadership and management competencies and processes for improving classroom instruction and student achievement',
   'c0000000-0000-4000-8000-000000000001');

INSERT INTO questions (statement, category, input_type, percentage, component_id) VALUES
  ('3.1 How many Primary school teachers were rated effective in classroom practices?',
   4, 0, TRUE, 'd0000000-0000-4000-8000-000000000003'),
  ('3.2 What number of member states adopted the Harmonized Quality Teaching Learning and Leadership Framework?',
   1, 0, FALSE, 'd0000000-0000-4000-8000-000000000003'),
  ('3.3 How many primary school principals were rated as demonstrating Good to Exceptionally high quality in leading learning?',
   1, 0, TRUE, 'd0000000-0000-4000-8000-000000000003'),
  ('3.4 How many primary school principals were rated as demonstrating Good to Exceptionally high quality on the performance indicators for "institutional strengthening" in OECS Leadership Standards?',
   1, 0, TRUE, 'd0000000-0000-4000-8000-000000000003'),
  ('3.5 How many school leaders reported on the progress of teachers'' practices and students'' learning to oversight bodies?',
   1, 0, TRUE, 'd0000000-0000-4000-8000-000000000003'),
  ('3.6 How many primary school leaders were certified through leadership and management courses?',
   5, 0, TRUE, 'd0000000-0000-4000-8000-000000000003'),
  ('3.7 How many primary school leaders participated in a structured CPD program?',
   5, 0, TRUE, 'd0000000-0000-4000-8000-000000000003'),
  ('3.8 How many primary schools across the OECS with a School Improvement Plan (SIP) focused on learning outcomes?',
   1, 0, TRUE, 'd0000000-0000-4000-8000-000000000003'),
  ('3.9 How many primary schools'' research reports on school improvement are approved for research publication?',
   1, 0, FALSE, 'd0000000-0000-4000-8000-000000000003');

-- Component 4
INSERT INTO components (id, title, objective, project_id) VALUES
  ('d0000000-0000-4000-8000-000000000004',
   'Component 4: Programme Management, Institutional Strengthening, Monitoring and Evaluation',
   'To strengthen the capacity of the education system for program management, monitoring, evaluating and reporting and to improve communications with key stakeholders',
   'c0000000-0000-4000-8000-000000000001');

INSERT INTO questions (statement, category, input_type, percentage, component_id) VALUES
  ('4.1 How many people were trained in Monitoring, Evaluation, Reporting & Learning (MERL) Framework, data collection, and analysis from the OECS commission?',
   4, 0, FALSE, 'd0000000-0000-4000-8000-000000000004'),
  ('4.2 Was the Regional and national MERL System established and functional?',
   0, 1, FALSE, 'd0000000-0000-4000-8000-000000000004'),
  ('4.3 How many member states developed and implemented National Change Management Plans?',
   1, 0, FALSE, 'd0000000-0000-4000-8000-000000000004'),
  ('4.4 Was the Mid-Term Evaluation for the PEARL program completed?',
   0, 0, FALSE, 'd0000000-0000-4000-8000-000000000004'),
  ('4.5 Was the Final Program Evaluation for the PEARL program completed?',
   0, 0, FALSE, 'd0000000-0000-4000-8000-000000000004');
