---
id: 02_playbooks__financial_services__solutions__readme_md
title: Financial Services Solutions
owner: ML1
status: draft
version: 1.0
created_date: 2026-03-09
last_updated: 2026-03-09
tags: [playbooks, financial-services, solutions]
---

# Financial Services Solutions

Canonical structure for financial-services solution packets:

```
FINANCIAL_SERVICES/
  SOLUTIONS/
    [SPECIFIC_SOLUTION]/
      MODULES/
        [MODULE_ID]/
          WORKFLOWS/
          TEMPLATES/
          CHECKLISTS/
```

Semantic mapping:
- `Solution`: productized legal offering
- `Module`: concrete deliverable unit executed under a solution
- `Workflows/Templates/Checklists`: execution assets that produce and control a module deliverable

## Registered Solution Folders

- `MSB_INTAKE_AND_REGISTRATION`
- `MSB_REVIEW`
- `FINTRAC_RESPONSE`
- `RPAA_REGISTRATION`
- `RPAA_THREE_YEAR_REVIEW`
- `BANK_ONBOARD` (placeholder)
- `BANK_REVIEW` (placeholder)
- `SOLUTION_PACKET_TEMPLATE`

## Migration Note

Legacy duplicated solution paths have been removed.
All canonical solution links must target this `SOLUTIONS/` tree.
Module packets must be linked through `MODULES/<MODULE_ID>/`.

## Backlogged Standardization Gap

Per-solution module decomposition is not yet fully standardized.
Current `MODULE_001_PRIMARY` folders are temporary placeholders pending canonical module definitions.
Tracked backlog item: `SYS-012` in `04_INITIATIVES/SYSTEM_PORTFOLIO/BACKLOG.md`.
