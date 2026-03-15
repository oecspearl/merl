# MERL Platform — Indicator Organisation Reference

This document defines how indicators are structured in the MERL platform database and UI. Use it as the authoritative reference when seeding data, building forms, or configuring disaggregation logic.

---

## Data Model Overview

Each indicator requires the following fields:

| Field | Type | Notes |
|---|---|---|
| `indicator_code` | string | e.g. `"2.1.4"`, `"3.1.1A"` |
| `component` | integer | 1, 2, 3, or 4 |
| `sub_component` | string | e.g. `"1.3"`, `"2.1"`, `"2.2"` |
| `description` | string | Full indicator text |
| `measurement_type` | enum | `"binary"` or `"quantitative"` |
| `disaggregation` | array | Any of: `"country"`, `"sex"`, `"post"`, `"region"` |
| `country_scope` | array | List of participating member state codes |
| `status` | enum | `"active"` or `"removed"` |

---

## Disaggregation Rules

Disaggregation operates in a fixed hierarchy where applicable:

1. **Region** (Component 4 only, for regional-level indicators)
2. **Country** — present on most quantitative indicators
3. **Post / Role** — education officers, principals, teachers (Component 1 and 3)
4. **Sex** — always `male` / `female`; use the term **sex**, not gender

When multiple disaggregation dimensions are present, they are applied in the order listed above. A record storing a data point must capture values for all dimensions assigned to that indicator.

---

## Country Scope Reference

Not all indicators cover all member states. Three distinct scopes appear across the framework:

| Scope Label | Member States Included |
|---|---|
| `ALL_CURRICULUM` | All 8 OECS member states in the curriculum component |
| `ALL_ASSESSMENT` | All OECS member states including 4 non-GPE territories |
| `GPE_ONLY` | GPE territories only |
| `CHANGE_MGMT` | Dominica, Grenada, St. Lucia, St. Vincent only |

> **Note:** Anguilla is **not participating** and must not appear in any country scope list.

Use these scope labels as constants in the codebase rather than hardcoding country lists per indicator.

---

## Component 1 — Early Childhood and Inclusive Education

### Sub-component 1.3 — Inclusive Education / Community Sensitisation

```
indicator_code: "1.3.1"
description:    "Completion of National Child Disability SEND Survey"
measurement:    binary
disaggregation: []
country_scope:  GPE_ONLY
status:         active
```

```
indicator_code: "1.3.1A"
description:    "Number of participants attending the ECE Forum"
status:         REMOVED
```

```
indicator_code: "1.3.2A"
description:    "Number of schools equipped with assistive learning devices"
measurement:    quantitative
disaggregation: ["country"]
country_scope:  GPE_ONLY
status:         active
```

```
indicator_code: "1.3.2B"
description:    "Percentage of students with special needs utilising assistive devices provided through OECS SKIP"
measurement:    quantitative
disaggregation: ["country", "sex"]
country_scope:  GPE_ONLY
status:         active
```

```
indicator_code: "1.3.community"
description:    "Implementation of community sensitisation programs"
measurement:    binary
disaggregation: []
country_scope:  GPE_ONLY
status:         active
```

```
indicator_code: "1.3.YC"
description:    "Number of persons reached annually through community sensitisation programs"
status:         REMOVED
```

### Educational Role Disaggregation (applies across Component 1 role-based indicators)

Where an indicator tracks personnel by role, apply disaggregation in this order:

1. Education level: `pre-primary` | `primary`
2. Role: `education_officer` | `principal` | `teacher`
3. Sex: `male` | `female`

---

## Component 2 — Curriculum and Standardised Assessment

### Sub-component 2.1 — Harmonised Curriculum

```
indicator_code: "2.1.1A"
description:    "Development of the OECS harmonised curriculum"
measurement:    binary
disaggregation: []
country_scope:  ALL_CURRICULUM
status:         active
```

```
indicator_code: "2.1.1B"
description:    "Percentage of observed lessons aligned with the new curriculum"
measurement:    quantitative
disaggregation: ["country"]
country_scope:  ALL_CURRICULUM   ← expanded from GPE-only; 4 non-GPE states added
status:         active
```

```
indicator_code: "2.1.2"
description:    "OECS primary harmonised curriculum piloted in GPE DCPS"
measurement:    binary
disaggregation: ["country"]     ← binary but all 8 countries listed to assign reporting responsibility
country_scope:  ALL_CURRICULUM
status:         active
```

```
indicator_code: "2.1.3"
description:    "Ministry of Education officials certified in curriculum and assessment through OECS PEARL"
measurement:    quantitative
disaggregation: []
country_scope:  ["Dominica", "Grenada", "St. Lucia", "St. Vincent"]   ← Windward Islands only
status:         active
```

### Sub-component 2.1 — Standardised Assessment

```
indicator_code: "2.1.4"
description:    "Percentage of OECS member states incorporating standardised reading assessments"
measurement:    quantitative
disaggregation: ["country"]
country_scope:  ALL_ASSESSMENT   ← expanded; 4 non-GPE states added
status:         active
```

```
indicator_code: "2.1.5"
description:    "Percentage of OECS member states incorporating standardised Grade 2 numeracy assessment"
measurement:    quantitative
disaggregation: ["country"]
country_scope:  ALL_ASSESSMENT   ← expanded; 4 non-GPE states added
status:         active
```

### Sub-component 2.2 — Student Learning Outcomes

```
indicator_code: "2.2.1"
description:    "Percentage of students reading at or above grade level"
measurement:    quantitative
disaggregation: ["country"]
country_scope:  ALL_ASSESSMENT   ← expanded; 4 non-GPE states added
status:         active
```

```
indicator_code: "2.2.2"
description:    "Percentage of students demonstrating numeracy skills at or above grade level"
measurement:    quantitative
disaggregation: ["country"]
country_scope:  ALL_ASSESSMENT   ← expanded; 4 non-GPE states added
status:         active
```

> **Implementation note:** The country scope expansion decision for 2.1.4 cascades identically to 2.1.5, 2.2.1, and 2.2.2. All four indicators share `ALL_ASSESSMENT` scope. Treat this as a group when updating country disaggregation fields.

---

## Component 3 — Primary School Leadership

**All Component 3 indicators are GPE territories only.**
**All use disaggregation: `["post", "country", "sex"]`.**
**The indicator list stops at 3.1.1C — do not extend.**

```
indicator_code: "3.1.1A"
description:    "Primary school principals' performance"
measurement:    quantitative
disaggregation: ["post", "country", "sex"]
country_scope:  GPE_ONLY
status:         active
```

```
indicator_code: "3.1.1B"
description:    "Primary school principals' certification"
measurement:    quantitative
disaggregation: ["post", "country", "sex"]
country_scope:  GPE_ONLY
status:         active
```

```
indicator_code: "3.1.1C"
description:    "Primary school principals' participation in CPD programs"
measurement:    quantitative
disaggregation: ["post", "country", "sex"]
country_scope:  GPE_ONLY
status:         active
```

```
indicator_code: "3.1.2"
description:    "Implementation of school improvement programs aligned with the OECS CSSI model"
measurement:    binary
disaggregation: []
country_scope:  GPE_ONLY
status:         active
```

---

## Component 4 — MERL System and Change Management

```
indicator_code: "4.1.1A"
description:    "Number of persons trained in MERL framework data collection and analysis"
measurement:    quantitative
disaggregation: ["region", "country", "sex"]
country_scope:  ALL_ASSESSMENT
status:         active
```

```
indicator_code: "4.1.1B"
description:    "Establishment of the regional and national MERL system"
measurement:    binary
disaggregation: []
country_scope:  regional
status:         active
```

```
indicator_code: "4.1.1C"
description:    "Number of member states implementing national change management programs"
measurement:    quantitative
disaggregation: ["country"]
country_scope:  CHANGE_MGMT     ← Dominica, Grenada, St. Lucia, St. Vincent only
status:         active
```

---

## Removed Indicators

Do not seed or render these. Keep records in the database with `status: "removed"` for audit purposes.

| Code | Description | Reason |
|---|---|---|
| `1.3.1A` | Number of participants attending the ECE Forum | Agreed removal — scope overlap |
| `1.3.YC` | Number of persons reached through community sensitisation | Agreed removal — scope overlap |

---

## Implementation Checklist

When building or seeding the MERL platform, verify the following:

- [ ] Binary indicators store `true` / `false` (or `1` / `0`), not numeric counts
- [ ] Removed indicators are present in the database but excluded from all data entry forms and reports
- [ ] Disaggregation dimensions are enforced at the form level — a submission for a `["country", "sex"]` indicator must capture both dimensions
- [ ] Country dropdowns are filtered by `country_scope` per indicator — do not display a global country list
- [ ] `sex` field uses values `male` and `female` only — do not use the label "gender" in the UI
- [ ] Component 2 assessment indicators (2.1.4, 2.1.5, 2.2.1, 2.2.2) share the expanded `ALL_ASSESSMENT` scope — update as a group if scope changes again
- [ ] Component 3 indicator list is capped at 3.1.1C — no additional sub-indicators
- [ ] Anguilla is excluded from all country scope lists
- [ ] Country names use the official shortened forms confirmed by Keith Thomas (pending receipt — do not hardcode until confirmed)
