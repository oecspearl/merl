# OECS PEARL Results Framework — Indicators, Levels & Disaggregation

## Project Details

| Field | Value |
|---|---|
| **Name** | OECS PEARL Results Framework |
| **Donor** | Whizzbridge |
| **Budget** | $10,000 |
| **Start Date** | 2021-07-01 |
| **End Date** | 2025-06-30 |
| **Reporting Period** | Yearly |
| **Fiscal Year** | July to June |

## Countries

| Short Name | Full Name | Region |
|---|---|---|
| DOM | Dominica | OECS |
| GRN | Grenada | OECS |
| SLU | St. Lucia | OECS |
| SVG | St. Vincent | OECS |

> **OECS Region Row**: Questions with `region: true` include an additional OECS-level aggregation row (stored with `country_id = null`).

---

## Disaggregation Constants

### Genders
| Key (stored) | Display |
|---|---|
| `male` | Male |
| `female` | Female |

### Trainings
| Key (stored) | Display |
|---|---|
| `ECE` | ECE |
| `SEN` | SEN |

### Ed Roles
| Key (stored) | Display |
|---|---|
| `ed_officers` | Ed Officers |
| `principal_teacher` | Principal Teacher |
| `deputy_principal` | Deputy Principal |
| `other_leader` | Other Leader |

### Posts
| Key (stored) | Display |
|---|---|
| `principal` | Principal |
| `deputy_principal` | Deputy Principal |

### Subjects
| Key (stored) | Display |
|---|---|
| `language_arts` | Language Arts |
| `science` | Science |
| `social_studies` | Social Studies |
| `mathematics` | Mathematics |

---

## Question Categories & Key Formats

### 0 — `no_level`
- **Columns**: *(none — single input per question)*
- **Key stored**: `null`
- **Example**: "4.2 Was the Regional and national MERL System established and functional?"

### 1 — `country`
- **Columns**: Country
- **Key stored**: `null` (one value per country)
- **Rows**: One row per country (DOM, GRN, SLU, SVG) + OECS if `region: true`

### 2 — `country_training_gender`
- **Columns**: Country | Training | Sex
- **Key stored**: `{Training}.{Gender}` (e.g. `ECE.Male`, `SEN.Female`)
- **Rows per country**: 4 (ECE×Male, ECE×Female, SEN×Male, SEN×Female)

| Country | Training | Sex | Key |
|---|---|---|---|
| DOM | ECE | Male | `ECE.Male` |
| | | Female | `ECE.Female` |
| | SEN | Male | `SEN.Male` |
| | | Female | `SEN.Female` |
| GRN | ECE | Male | `ECE.Male` |
| ... | ... | ... | ... |

### 3 — `country_subject`
- **Columns**: Country | Subject
- **Key stored**: `{Subject}` (e.g. `Language Arts`, `Mathematics`)
- **Rows per country**: 4

| Country | Subject | Key |
|---|---|---|
| DOM | Language Arts | `Language Arts` |
| | Science | `Science` |
| | Social Studies | `Social Studies` |
| | Mathematics | `Mathematics` |
| GRN | Language Arts | `Language Arts` |
| ... | ... | ... |

### 4 — `country_gender`
- **Columns**: Country | Sex
- **Key stored**: `{Gender}` (e.g. `Male`, `Female`)
- **Rows per country**: 2

| Country | Sex | Key |
|---|---|---|
| DOM | Male | `Male` |
| | Female | `Female` |
| GRN | Male | `Male` |
| ... | ... | ... |

### 5 — `country_post`
- **Columns**: Country | Post
- **Key stored**: `{Post}` (e.g. `Principal`, `Deputy Principal`)
- **Rows per country**: 2

| Country | Post | Key |
|---|---|---|
| DOM | Principal | `Principal` |
| | Deputy Principal | `Deputy Principal` |
| GRN | Principal | `Principal` |
| ... | ... | ... |

### 6 — `country_gender_edrole`
- **Columns**: Country | Sex | Edrole
- **Key stored**: `{Gender}.{Edrole}` (e.g. `Male.Ed Officers`, `Female.Deputy Principal`)
- **Rows per country**: 8 (2 genders × 4 roles)

| Country | Sex | Edrole | Key |
|---|---|---|---|
| DOM | Male | Ed Officers | `Male.Ed Officers` |
| | | Principal Teacher | `Male.Principal Teacher` |
| | | Deputy Principal | `Male.Deputy Principal` |
| | | Other Leader | `Male.Other Leader` |
| | Female | Ed Officers | `Female.Ed Officers` |
| | | Principal Teacher | `Female.Principal Teacher` |
| | | Deputy Principal | `Female.Deputy Principal` |
| | | Other Leader | `Female.Other Leader` |
| GRN | Male | Ed Officers | `Male.Ed Officers` |
| ... | ... | ... | ... |

---

## Component 1: Enhanced quality and equity of access to ECDs and Special Education Needs (SEN) Services

**Objective**: Enhanced Quality and Equity of Access to Early Childhood Education and Special Education Needs

| # | Statement | Category | Input | % | Region |
|---|---|---|---|---|---|
| 1.1 | How many pre-primary classrooms have been established and equipped according to minimum standards? | `country` | number | No | No |
| 1.2 | How many pre-primary and primary administrators have been trained to support in-service child-centered leaders in the country? | `country_training_gender` | number | No | No |
| 1.3 | How many participants in total attended the ECE Forum? | `country` | number | No | No |
| 1.4 | Is the National Child Disability & SEN Survey completed? | `country` | boolean | No | No |
| 1.5 | How many persons were reached annually through social media, TV, and/or radio? | `country_gender` | number | No | No |

### 1.1 — Disaggregation
```
Country  | Value
---------|------
DOM      | ___
GRN      | ___
SLU      | ___
SVG      | ___
```

### 1.2 — Disaggregation
```
Country | Training | Sex    | Value
--------|----------|--------|------
DOM     | ECE      | Male   | ___
        |          | Female | ___
        | SEN      | Male   | ___
        |          | Female | ___
GRN     | ECE      | Male   | ___
        |          | Female | ___
        | SEN      | Male   | ___
        |          | Female | ___
SLU     | ECE      | Male   | ___
        |          | Female | ___
        | SEN      | Male   | ___
        |          | Female | ___
SVG     | ECE      | Male   | ___
        |          | Female | ___
        | SEN      | Male   | ___
        |          | Female | ___
```

### 1.3 — Disaggregation
```
Country  | Value
---------|------
DOM      | ___
GRN      | ___
SLU      | ___
SVG      | ___
```

### 1.4 — Disaggregation
```
Country  | Yes/No
---------|-------
DOM      | ___
GRN      | ___
SLU      | ___
SVG      | ___
```

### 1.5 — Disaggregation
```
Country | Sex    | Value
--------|--------|------
DOM     | Male   | ___
        | Female | ___
GRN     | Male   | ___
        | Female | ___
SLU     | Male   | ___
        | Female | ___
SVG     | Male   | ___
        | Female | ___
```

---

## Component 2: Enhanced Curriculum & Assessment

**Objective**: Enhanced Curriculum and Assessment

| # | Statement | Category | Input | % | Region |
|---|---|---|---|---|---|
| 2.1 | How many classroom observations were completed? | `country` | number | Yes | No |
| 2.2 | How many primary teachers used formative assessments based on learning standards? | `country` | number | Yes | No |
| 2.3 | How many successful OHPC pilots were conducted? | `country_subject` | number | No | No |
| 2.4 | How many Ministry of Education Officials were certified in curriculum and assessment? | `country` | number | No | No |
| 2.5 | How many member states incorporated the standardized grade 2 reading assessment into national assessments? | `country` | number | Yes | No |
| 2.6 | How many member states incorporated the standardized grade 2 numeracy assessment into national assessments? | `country` | number | Yes | No |

### 2.3 — Disaggregation
```
Country | Subject        | Value
--------|----------------|------
DOM     | Language Arts   | ___
        | Science         | ___
        | Social Studies  | ___
        | Mathematics     | ___
GRN     | Language Arts   | ___
        | Science         | ___
        | Social Studies  | ___
        | Mathematics     | ___
SLU     | Language Arts   | ___
        | Science         | ___
        | Social Studies  | ___
        | Mathematics     | ___
SVG     | Language Arts   | ___
        | Science         | ___
        | Social Studies  | ___
        | Mathematics     | ___
```

---

## Component 3: Strengthened Leadership and Management

**Objective**: To enhance educational leadership and management competencies and processes for improving classroom instruction and student achievement

| # | Statement | Category | Input | % | Region |
|---|---|---|---|---|---|
| 3.1 | How many Primary school teachers were rated effective in classroom practices? | `country_gender` | number | Yes | No |
| 3.2 | What number of member states adopted the Harmonized Quality Teaching Learning and Leadership Framework? | `country` | number | No | No |
| 3.3 | How many primary school principals were rated as demonstrating Good to Exceptionally high quality in leading learning? | `country` | number | Yes | No |
| 3.4 | How many primary school principals were rated as demonstrating Good to Exceptionally high quality on the performance indicators for "institutional strengthening" in OECS Leadership Standards? | `country` | number | Yes | No |
| 3.5 | How many school leaders reported on the progress of teachers' practices and students' learning to oversight bodies? | `country` | number | Yes | No |
| 3.6 | How many primary school leaders were certified through leadership and management courses? | `country_post` | number | Yes | No |
| 3.7 | How many primary school leaders participated in a structured CPD program? | `country_post` | number | Yes | No |
| 3.8 | How many primary schools across the OECS with a School Improvement Plan (SIP) focused on learning outcomes? | `country` | number | Yes | No |
| 3.9 | How many primary schools' research reports on school improvement are approved for research publication? | `country` | number | No | No |

### 3.1 — Disaggregation
```
Country | Sex    | Value (%)
--------|--------|----------
DOM     | Male   | ___
        | Female | ___
GRN     | Male   | ___
        | Female | ___
SLU     | Male   | ___
        | Female | ___
SVG     | Male   | ___
        | Female | ___
```

### 3.6 / 3.7 — Disaggregation
```
Country | Post              | Value (%)
--------|-------------------|----------
DOM     | Principal         | ___
        | Deputy Principal  | ___
GRN     | Principal         | ___
        | Deputy Principal  | ___
SLU     | Principal         | ___
        | Deputy Principal  | ___
SVG     | Principal         | ___
        | Deputy Principal  | ___
```

---

## Component 4: Programme Management, Institutional Strengthening, Monitoring and Evaluation

**Objective**: To strengthen the capacity of the education system for program management, monitoring, evaluating and reporting and to improve communications with key stakeholders

| # | Statement | Category | Input | % | Region |
|---|---|---|---|---|---|
| 4.1 | How many people were trained in Monitoring, Evaluation, Reporting & Learning (MERL) Framework, data collection, and analysis from the OECS commission? | `country_gender` | number | No | No |
| 4.2 | Was the Regional and national MERL System established and functional? | `no_level` | boolean | No | No |
| 4.3 | How many member states developed and implemented National Change Management Plans? | `country` | number | No | No |
| 4.4 | Was the Mid-Term Evaluation for the PEARL program completed? | `no_level` | number | No | No |
| 4.5 | Was the Final Program Evaluation for the PEARL program completed? | `no_level` | number | No | No |

### 4.1 — Disaggregation
```
Country | Sex    | Value
--------|--------|------
DOM     | Male   | ___
        | Female | ___
GRN     | Male   | ___
        | Female | ___
SLU     | Male   | ___
        | Female | ___
SVG     | Male   | ___
        | Female | ___
```

### 4.2 — Disaggregation
```
(No disaggregation — single Yes/No answer)
```

### 4.4 / 4.5 — Disaggregation
```
(No disaggregation — single numeric answer)
```

---

## Key Format Reference

All disaggregation keys use **dot (`.`) separator** and **titleized values**, matching the Rails production database format.

| Category | Key Pattern | Example Keys |
|---|---|---|
| `no_level` | `null` | — |
| `country` | `null` | — |
| `country_gender` | `{Gender}` | `Male`, `Female` |
| `country_training_gender` | `{Training}.{Gender}` | `ECE.Male`, `ECE.Female`, `SEN.Male`, `SEN.Female` |
| `country_subject` | `{Subject}` | `Language Arts`, `Science`, `Social Studies`, `Mathematics` |
| `country_post` | `{Post}` | `Principal`, `Deputy Principal` |
| `country_gender_edrole` | `{Gender}.{Edrole}` | `Male.Ed Officers`, `Male.Principal Teacher`, `Male.Deputy Principal`, `Male.Other Leader`, `Female.Ed Officers`, `Female.Principal Teacher`, `Female.Deputy Principal`, `Female.Other Leader` |

---

## OECS Region Aggregation

When a question has `region: true`:
- An additional **OECS** row appears after all country rows
- OECS data is stored with `country_id = null`
- Each disaggregation key gets its own OECS-level value
- Example for `country_gender` with region:

```
Country | Sex    | Value
--------|--------|------
DOM     | Male   | ___
        | Female | ___
GRN     | Male   | ___
        | Female | ___
SLU     | Male   | ___
        | Female | ___
SVG     | Male   | ___
        | Female | ___
OECS    | Male   | ___
        | Female | ___
```

---

## Means of Verification Options

1. Audit Reports
2. Site Visits
3. Press Releases
4. Training Completion Certificates
5. Forum Attendance Register
6. Forum Participants Evaluation
7. Final Survey Report
8. Country Reports
9. Report On Findings
10. Consultants Report
11. Participants Grades
12. Completion Certificates
13. MoE Reports
14. Survey
15. Endorsment Declaration From MS
16. Approved Sips
17. Approved Research Publications
18. Training Report
19. Merl System
20. Approved Change Management Strategy For Regional And National
21. Approved MTE Report
22. Approved Final Program Evaluation Report
