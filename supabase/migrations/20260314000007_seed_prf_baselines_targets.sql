-- ============================================================
-- SEED: Baselines & Targets from OECS PEARL Performance Results Framework
-- Source: OECS_PEARL_Performance_Result_Framework (Updated Sept 9, 2024)
--
-- Country IDs:
--   DOM = b0000000-0000-4000-8000-000000000001
--   GRN = b0000000-0000-4000-8000-000000000002
--   SLU = b0000000-0000-4000-8000-000000000003
--   SVG = b0000000-0000-4000-8000-000000000004
-- ============================================================


-- ============================================================
-- PART 0: NEW QUESTIONS (PRF indicators missing from seed)
-- ============================================================

INSERT INTO questions (id, statement, category, input_type, percentage, component_id) VALUES
  ('e1000000-0000-4000-8000-000000000001',
   '1.2.2 Percentage of pre-primary and primary educators trained in SEN services through the OECS PEARL',
   2, 0, TRUE, 'd0000000-0000-4000-8000-000000000001'),
  ('e1000000-0000-4000-8000-000000000002',
   '1.3.2a Number of schools equipped with assistive learning devices',
   1, 0, FALSE, 'd0000000-0000-4000-8000-000000000001'),
  ('e1000000-0000-4000-8000-000000000003',
   '1.3.2b Percentage of students with special needs utilizing assistive devices provided through the OECS PEARL',
   4, 0, TRUE, 'd0000000-0000-4000-8000-000000000001'),
  ('e1000000-0000-4000-8000-000000000004',
   '2.1.1a OECS Harmonised Curriculum Developed',
   0, 1, FALSE, 'd0000000-0000-4000-8000-000000000002'),
  ('e1000000-0000-4000-8000-000000000005',
   '2.2.1 Percentage of grade 2 students reading at or above grade level',
   4, 0, TRUE, 'd0000000-0000-4000-8000-000000000002'),
  ('e1000000-0000-4000-8000-000000000006',
   '2.2.2 Percentage of students demonstrating numeracy skills at or above grade level',
   4, 0, TRUE, 'd0000000-0000-4000-8000-000000000002')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- PART 1: BASELINES (existing questions)
-- ============================================================

-- PRF 1.1.1: Number of pre-primary classrooms (category=1, key=NULL)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('7cf07326-a934-4ec8-92b6-d95902616154', 'b0000000-0000-4000-8000-000000000001', NULL, '0', 0),
  ('7cf07326-a934-4ec8-92b6-d95902616154', 'b0000000-0000-4000-8000-000000000002', NULL, '0', 0),
  ('7cf07326-a934-4ec8-92b6-d95902616154', 'b0000000-0000-4000-8000-000000000003', NULL, '0', 0),
  ('7cf07326-a934-4ec8-92b6-d95902616154', 'b0000000-0000-4000-8000-000000000004', NULL, '0', 0);

-- PRF 1.2.1: Educators trained in child-centred learning (category=2, key="Level / Role / Gender")
-- N/A baselines skipped
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Ed. Officers / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Ed. Officers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Principals / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Teachers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Ed. Officers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Principals / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Principals / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Teachers / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Teachers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Ed. Officers / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Ed. Officers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Principals / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Teachers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Ed. Officers / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Ed. Officers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Principals / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Principals / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Teachers / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Teachers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Ed. Officers / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Ed. Officers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Principal / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Principal / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Teacher / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Teacher / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Ed. Officers / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Ed. Officers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Principal / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Principal / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Teacher / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Teacher / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Primary / Ed. Officers / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Primary / Ed. Officers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Primary / Principal / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Primary / Principal / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Primary / Teacher / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Primary / Teacher / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Primary / Ed. Officers / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Primary / Ed. Officers / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Primary / Principal / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Primary / Principal / Female', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Primary / Teacher / Male', '0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Primary / Teacher / Female', '0', 0);

-- PRF 1.3.1: SEN Survey completed (boolean, no country)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('bc4d5027-bf18-4996-81b1-a6bff0bbcc9b', NULL, NULL, 'No', 0);

-- PRF 2.1.1b: Classroom observations aligned to OHPC (category=1)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('f3f9ecce-61b2-4478-bc54-98e71a1d06b4', 'b0000000-0000-4000-8000-000000000001', NULL, '0', 0),
  ('f3f9ecce-61b2-4478-bc54-98e71a1d06b4', 'b0000000-0000-4000-8000-000000000002', NULL, '0', 0),
  ('f3f9ecce-61b2-4478-bc54-98e71a1d06b4', 'b0000000-0000-4000-8000-000000000003', NULL, '0', 0),
  ('f3f9ecce-61b2-4478-bc54-98e71a1d06b4', 'b0000000-0000-4000-8000-000000000004', NULL, '0', 0);

-- PRF 2.1.3: MoE officials certified in C&A (category=1, summed M+F)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('0b4e3f3e-bfbd-4fa8-b03c-ede42b83e1ff', 'b0000000-0000-4000-8000-000000000001', NULL, '0', 0),
  ('0b4e3f3e-bfbd-4fa8-b03c-ede42b83e1ff', 'b0000000-0000-4000-8000-000000000002', NULL, '0', 0),
  ('0b4e3f3e-bfbd-4fa8-b03c-ede42b83e1ff', 'b0000000-0000-4000-8000-000000000003', NULL, '0', 0),
  ('0b4e3f3e-bfbd-4fa8-b03c-ede42b83e1ff', 'b0000000-0000-4000-8000-000000000004', NULL, '0', 0);

-- PRF 2.1.4: Reading assessment (category=1)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('8dd146d2-c1af-4695-9c1f-b131aabb9016', 'b0000000-0000-4000-8000-000000000001', NULL, '0', 0),
  ('8dd146d2-c1af-4695-9c1f-b131aabb9016', 'b0000000-0000-4000-8000-000000000002', NULL, '0', 0),
  ('8dd146d2-c1af-4695-9c1f-b131aabb9016', 'b0000000-0000-4000-8000-000000000003', NULL, '0', 0),
  ('8dd146d2-c1af-4695-9c1f-b131aabb9016', 'b0000000-0000-4000-8000-000000000004', NULL, '0', 0);

-- PRF 2.1.5: Numeracy assessment (category=1)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('06f588da-0e74-483b-a49d-a82069d16a91', 'b0000000-0000-4000-8000-000000000001', NULL, '0', 0),
  ('06f588da-0e74-483b-a49d-a82069d16a91', 'b0000000-0000-4000-8000-000000000002', NULL, '0', 0),
  ('06f588da-0e74-483b-a49d-a82069d16a91', 'b0000000-0000-4000-8000-000000000003', NULL, '0', 0),
  ('06f588da-0e74-483b-a49d-a82069d16a91', 'b0000000-0000-4000-8000-000000000004', NULL, '0', 0);

-- PRF 3.1.1a: Teachers rated effective (category=4, key="Male"/"Female")
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000001', 'Male', '0', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000001', 'Female', '0', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000002', 'Male', '0.33', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000002', 'Female', '0.43', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000003', 'Male', '0', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000003', 'Female', '0', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000004', 'Male', '0', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000004', 'Female', '0.33', 0);

-- PRF 3.1.1b: Leaders certified in L&M (category=5, key="Post / Gender")
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000001', 'Principal / Male', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000001', 'Principal / Female', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Dty. Principal / Male', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Dty. Principal / Female', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Principal / Male', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Principal / Female', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Other Leaders / Male', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Other Leaders / Female', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000003', 'Dty. Principal / Female', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000003', 'Principal / Male', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000003', 'Principal / Female', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000003', 'Other Leaders / Male', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000003', 'Other Leaders / Female', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000004', 'Principal / Male', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000004', 'Principal / Female', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000004', 'Other Leaders / Male', '0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000004', 'Other Leaders / Female', '0', 0);

-- PRF 3.1.1c: Leaders in CPD (category=5, key="Post / Gender")
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000001', 'Principal / Male', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000001', 'Principal / Female', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000002', 'Dty. Principal / Male', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000002', 'Dty. Principal / Female', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000002', 'Principal / Male', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000002', 'Principal / Female', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000002', 'Other Leaders / Male', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000002', 'Other Leaders / Female', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000003', 'Dty. Principal / Female', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000003', 'Principal / Male', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000003', 'Principal / Female', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000004', 'Principal / Male', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000004', 'Principal / Female', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000004', 'Other Leaders / Male', '0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000004', 'Other Leaders / Female', '0', 0);

-- PRF 3.1.2: SIPs aligned to CSSI (category=1)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('639ca889-8cc6-4c99-88af-8760b5c76be1', 'b0000000-0000-4000-8000-000000000001', NULL, '0', 0),
  ('639ca889-8cc6-4c99-88af-8760b5c76be1', 'b0000000-0000-4000-8000-000000000002', NULL, '0', 0),
  ('639ca889-8cc6-4c99-88af-8760b5c76be1', 'b0000000-0000-4000-8000-000000000003', NULL, '0', 0),
  ('639ca889-8cc6-4c99-88af-8760b5c76be1', 'b0000000-0000-4000-8000-000000000004', NULL, '0', 0);

-- PRF 4.1.1a: MERL training (category=4, key="Male"/"Female")
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000001', 'Male', '0', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000001', 'Female', '0', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000002', 'Male', '0', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000002', 'Female', '0', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000003', 'Male', '4', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000003', 'Female', '12', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000004', 'Male', '0', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000004', 'Female', '0', 0);

-- PRF 4.1.1b: MERL system established (boolean, no country)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('837f4554-c8a0-46a9-be53-b71a31c23f0a', NULL, NULL, 'No', 0);

-- PRF 4.1.1c: Change management plans (category=1)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('7e596e21-09fd-4969-b4c2-ba256e332391', 'b0000000-0000-4000-8000-000000000001', NULL, '1', 0),
  ('7e596e21-09fd-4969-b4c2-ba256e332391', 'b0000000-0000-4000-8000-000000000002', NULL, '1', 0),
  ('7e596e21-09fd-4969-b4c2-ba256e332391', 'b0000000-0000-4000-8000-000000000003', NULL, '1', 0),
  ('7e596e21-09fd-4969-b4c2-ba256e332391', 'b0000000-0000-4000-8000-000000000004', NULL, '1', 0);


-- ============================================================
-- PART 2: BASELINES (new questions)
-- ============================================================

-- PRF 1.2.2: SEN training (category=2, key="Level / Role / Gender")
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Ed. Officers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Principals / Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Principals / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Teachers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Ed. Officers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Principals / Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Principals / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Teachers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Ed. Officers / Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Ed. Officers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Principals / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Teachers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Ed. Officers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Principals / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Teachers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Primary / Ed. Officers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Primary / Principal / Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Primary / Principal / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Primary / Teacher / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Primary / Ed. Officers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Primary / Principal / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Primary / Teacher / Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Primary / Teacher / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Primary / Ed. Officers / Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Primary / Ed. Officers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Primary / Principal / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Primary / Teacher / Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Primary / Teacher / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Ed. Officers / Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Ed. Officers / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Principal / Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Principal / Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Teacher / Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Teacher / Female', '0', 0);

-- PRF 1.3.2a: Schools with assistive devices (category=1)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', NULL, '0', 0),
  ('e1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', NULL, '0', 0),
  ('e1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000003', NULL, '0', 0),
  ('e1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000004', NULL, '0', 0);

-- PRF 1.3.2b: Students using assistive devices (category=4)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000002', 'Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000002', 'Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003', 'Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003', 'Female', '0', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000004', 'Male', '0', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000004', 'Female', '0', 0);

-- PRF 2.1.1a: Harmonised Curriculum (boolean, no country)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000004', NULL, NULL, 'No', 0);

-- PRF 2.2.1: Grade 2 reading (category=4, baselines="..." → NULL)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000001', 'Male', NULL, 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000001', 'Female', NULL, 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000002', 'Male', NULL, 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000002', 'Female', NULL, 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000003', 'Male', NULL, 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000003', 'Female', NULL, 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000004', 'Male', NULL, 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000004', 'Female', NULL, 0);

-- PRF 2.2.2: Grade 2 numeracy (category=4, baselines="..." → NULL)
INSERT INTO baselines (question_id, country_id, key, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000001', 'Male', NULL, 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000001', 'Female', NULL, 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000002', 'Male', NULL, 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000002', 'Female', NULL, 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000003', 'Male', NULL, 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000003', 'Female', NULL, 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000004', 'Male', NULL, 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000004', 'Female', NULL, 0);


-- ============================================================
-- PART 3: TARGETS (existing questions)
-- ============================================================

-- PRF 1.1.1: Classrooms
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('7cf07326-a934-4ec8-92b6-d95902616154', 'b0000000-0000-4000-8000-000000000001', NULL, 'End', '5', 0),
  ('7cf07326-a934-4ec8-92b6-d95902616154', 'b0000000-0000-4000-8000-000000000002', NULL, 'End', '5', 0),
  ('7cf07326-a934-4ec8-92b6-d95902616154', 'b0000000-0000-4000-8000-000000000003', NULL, 'End', '5', 0),
  ('7cf07326-a934-4ec8-92b6-d95902616154', 'b0000000-0000-4000-8000-000000000004', NULL, 'End', '5', 0);

-- PRF 1.2.1: Educators trained child-centred (N/A targets skipped)
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Ed. Officers / Male', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Principals / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Teachers / Female', 'End', '0.85', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Principals / Male', 'End', '0.7', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Principals / Female', 'End', '0.7', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Teachers / Male', 'End', '0.7', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Teachers / Female', 'End', '0.7', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Ed. Officers / Male', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Principals / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Teachers / Female', 'End', '0.8', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Principals / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Teachers / Female', 'End', '0.75', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Ed. Officers / Male', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Principal / Male', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Principal / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Teacher / Male', 'End', '0.75', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000001', 'Primary / Teacher / Female', 'End', '0.75', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Principal / Male', 'End', '0.7', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Principal / Female', 'End', '0.7', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Teacher / Male', 'End', '0.7', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000002', 'Primary / Teacher / Female', 'End', '0.7', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Primary / Ed. Officers / Male', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Primary / Principal / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000003', 'Primary / Teacher / Female', 'End', '0.8', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Primary / Principal / Female', 'End', '1.0', 0),
  ('509d9a1e-ce86-4563-aa40-9bcb6c213d81', 'b0000000-0000-4000-8000-000000000004', 'Primary / Teacher / Female', 'End', '0.75', 0);

-- PRF 1.3.1: SEN Survey (boolean)
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('bc4d5027-bf18-4996-81b1-a6bff0bbcc9b', NULL, NULL, 'End', 'Yes', 0);

-- PRF 2.1.1b: Classroom observations
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('f3f9ecce-61b2-4478-bc54-98e71a1d06b4', 'b0000000-0000-4000-8000-000000000001', NULL, 'End', '0.75', 0),
  ('f3f9ecce-61b2-4478-bc54-98e71a1d06b4', 'b0000000-0000-4000-8000-000000000002', NULL, 'End', '0.6', 0),
  ('f3f9ecce-61b2-4478-bc54-98e71a1d06b4', 'b0000000-0000-4000-8000-000000000003', NULL, 'End', '0.75', 0),
  ('f3f9ecce-61b2-4478-bc54-98e71a1d06b4', 'b0000000-0000-4000-8000-000000000004', NULL, 'End', '0.6', 0);

-- PRF 2.1.3: MoE officials (summed M+F per country)
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('0b4e3f3e-bfbd-4fa8-b03c-ede42b83e1ff', 'b0000000-0000-4000-8000-000000000001', NULL, 'End', '16', 0),
  ('0b4e3f3e-bfbd-4fa8-b03c-ede42b83e1ff', 'b0000000-0000-4000-8000-000000000002', NULL, 'End', '15', 0),
  ('0b4e3f3e-bfbd-4fa8-b03c-ede42b83e1ff', 'b0000000-0000-4000-8000-000000000003', NULL, 'End', '15', 0),
  ('0b4e3f3e-bfbd-4fa8-b03c-ede42b83e1ff', 'b0000000-0000-4000-8000-000000000004', NULL, 'End', '15', 0);

-- PRF 2.1.4: Reading assessment
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('8dd146d2-c1af-4695-9c1f-b131aabb9016', 'b0000000-0000-4000-8000-000000000001', NULL, 'End', '1.0', 0),
  ('8dd146d2-c1af-4695-9c1f-b131aabb9016', 'b0000000-0000-4000-8000-000000000002', NULL, 'End', '1.0', 0),
  ('8dd146d2-c1af-4695-9c1f-b131aabb9016', 'b0000000-0000-4000-8000-000000000003', NULL, 'End', '1.0', 0),
  ('8dd146d2-c1af-4695-9c1f-b131aabb9016', 'b0000000-0000-4000-8000-000000000004', NULL, 'End', '1.0', 0);

-- PRF 2.1.5: Numeracy assessment
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('06f588da-0e74-483b-a49d-a82069d16a91', 'b0000000-0000-4000-8000-000000000001', NULL, 'End', '1.0', 0),
  ('06f588da-0e74-483b-a49d-a82069d16a91', 'b0000000-0000-4000-8000-000000000002', NULL, 'End', '1.0', 0),
  ('06f588da-0e74-483b-a49d-a82069d16a91', 'b0000000-0000-4000-8000-000000000003', NULL, 'End', '1.0', 0),
  ('06f588da-0e74-483b-a49d-a82069d16a91', 'b0000000-0000-4000-8000-000000000004', NULL, 'End', '1.0', 0);

-- PRF 3.1.1a: Teachers rated effective
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000001', 'Male', 'End', '0.85', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000001', 'Female', 'End', '0.85', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000002', 'Male', 'End', '0.75', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000002', 'Female', 'End', '0.75', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000003', 'Male', 'End', '0.95', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000003', 'Female', 'End', '0.95', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000004', 'Male', 'End', '0.85', 0),
  ('b244ed0b-a8df-4269-b04e-09bb87b08597', 'b0000000-0000-4000-8000-000000000004', 'Female', 'End', '0.85', 0);

-- PRF 3.1.1b: Leaders certified (N/A targets skipped)
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000001', 'Principal / Male', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000001', 'Principal / Female', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Dty. Principal / Male', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Dty. Principal / Female', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Principal / Male', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Principal / Female', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Other Leaders / Male', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000002', 'Other Leaders / Female', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000003', 'Dty. Principal / Female', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000003', 'Principal / Male', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000003', 'Principal / Female', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000003', 'Other Leaders / Male', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000003', 'Other Leaders / Female', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000004', 'Principal / Male', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000004', 'Principal / Female', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000004', 'Other Leaders / Male', 'End', '1.0', 0),
  ('6c7fa5c9-56bf-4ece-b293-e1872ac5bda7', 'b0000000-0000-4000-8000-000000000004', 'Other Leaders / Female', 'End', '1.0', 0);

-- PRF 3.1.1c: Leaders in CPD (N/A targets skipped)
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000001', 'Principal / Male', 'End', '1.0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000001', 'Principal / Female', 'End', '1.0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000002', 'Dty. Principal / Male', 'End', '0.75', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000002', 'Dty. Principal / Female', 'End', '0.75', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000002', 'Principal / Male', 'End', '0.9', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000002', 'Principal / Female', 'End', '0.9', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000003', 'Dty. Principal / Female', 'End', '1.0', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000003', 'Principal / Male', 'End', '0.1', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000003', 'Principal / Female', 'End', '0.9', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000004', 'Principal / Male', 'End', '0.75', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000004', 'Principal / Female', 'End', '0.75', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000004', 'Other Leaders / Male', 'End', '0.65', 0),
  ('04a9dd68-5950-47df-8956-be8ea0b99bb6', 'b0000000-0000-4000-8000-000000000004', 'Other Leaders / Female', 'End', '0.65', 0);

-- PRF 3.1.2: SIPs
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('639ca889-8cc6-4c99-88af-8760b5c76be1', 'b0000000-0000-4000-8000-000000000001', NULL, 'End', '1.0', 0),
  ('639ca889-8cc6-4c99-88af-8760b5c76be1', 'b0000000-0000-4000-8000-000000000002', NULL, 'End', '1.0', 0),
  ('639ca889-8cc6-4c99-88af-8760b5c76be1', 'b0000000-0000-4000-8000-000000000003', NULL, 'End', '1.0', 0),
  ('639ca889-8cc6-4c99-88af-8760b5c76be1', 'b0000000-0000-4000-8000-000000000004', NULL, 'End', '1.0', 0);

-- PRF 4.1.1a: MERL training
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000001', 'Male', 'End', '38', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000001', 'Female', 'End', '13', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000002', 'Male', 'End', '15', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000002', 'Female', 'End', '35', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000003', 'Male', 'End', '38', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000003', 'Female', 'End', '22', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000004', 'Male', 'End', '15', 0),
  ('36ff5239-0489-4e73-87a6-4f6f613911c0', 'b0000000-0000-4000-8000-000000000004', 'Female', 'End', '35', 0);

-- PRF 4.1.1b: MERL system (boolean)
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('837f4554-c8a0-46a9-be53-b71a31c23f0a', NULL, NULL, 'End', 'Yes', 0);

-- PRF 4.1.1c: Change management plans
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('7e596e21-09fd-4969-b4c2-ba256e332391', 'b0000000-0000-4000-8000-000000000001', NULL, 'End', '1', 0),
  ('7e596e21-09fd-4969-b4c2-ba256e332391', 'b0000000-0000-4000-8000-000000000002', NULL, 'End', '1', 0),
  ('7e596e21-09fd-4969-b4c2-ba256e332391', 'b0000000-0000-4000-8000-000000000003', NULL, 'End', '1', 0),
  ('7e596e21-09fd-4969-b4c2-ba256e332391', 'b0000000-0000-4000-8000-000000000004', NULL, 'End', '1', 0);


-- ============================================================
-- PART 4: TARGETS (new questions)
-- ============================================================

-- PRF 1.2.2: SEN training targets (N/A skipped)
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Ed. Officers / Female', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Principals / Male', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Principals / Female', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Pre-Primary / Teachers / Female', 'End', '0.7', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Ed. Officers / Female', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Principals / Male', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Principals / Female', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Pre-Primary / Teachers / Female', 'End', '0.4', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Ed. Officers / Male', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Principals / Female', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Pre-Primary / Teachers / Female', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Principals / Female', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Pre-Primary / Teachers / Female', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Primary / Ed. Officers / Female', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Primary / Principal / Male', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Primary / Principal / Female', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Primary / Teacher / Female', 'End', '0.7', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Primary / Ed. Officers / Female', 'End', '80.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Primary / Principal / Female', 'End', '80.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Primary / Teacher / Male', 'End', '0.7', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'Primary / Teacher / Female', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Primary / Ed. Officers / Male', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Primary / Ed. Officers / Female', 'End', '1.0', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Primary / Principal / Female', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Primary / Teacher / Male', 'End', '0.65', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'Primary / Teacher / Female', 'End', '0.65', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Ed. Officers / Male', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Ed. Officers / Female', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Principal / Male', 'End', '0.5', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Principal / Female', 'End', '0.5', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Teacher / Male', 'End', '0.25', 0),
  ('e1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'Primary / Teacher / Female', 'End', '0.25', 0);

-- PRF 1.3.2a: Schools with assistive devices
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', NULL, 'End', '25', 0),
  ('e1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', NULL, 'End', '50', 0),
  ('e1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000003', NULL, 'End', '45', 0),
  ('e1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000004', NULL, 'End', '10', 0);

-- PRF 1.3.2b: Students using assistive devices
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'Male', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'Female', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000002', 'Male', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000002', 'Female', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003', 'Male', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003', 'Female', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000004', 'Male', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000004', 'Female', 'End', '0.8', 0);

-- PRF 2.1.1a: Harmonised Curriculum (boolean)
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000004', NULL, NULL, 'End', 'Yes', 0);

-- PRF 2.2.1: Grade 2 reading targets
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000001', 'Male', 'End', '0.85', 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000001', 'Female', 'End', '0.85', 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000002', 'Male', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000002', 'Female', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000003', 'Male', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000003', 'Female', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000004', 'Male', 'End', '0.6', 0),
  ('e1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000004', 'Female', 'End', '0.6', 0);

-- PRF 2.2.2: Grade 2 numeracy targets
INSERT INTO targets (question_id, country_id, key, year, value, status) VALUES
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000001', 'Male', 'End', '0.85', 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000001', 'Female', 'End', '0.85', 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000002', 'Male', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000002', 'Female', 'End', '0.8', 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000003', 'Male', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000003', 'Female', 'End', '0.75', 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000004', 'Male', 'End', '0.65', 0),
  ('e1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000004', 'Female', 'End', '0.65', 0);
