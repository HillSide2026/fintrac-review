---
id: 02_playbooks__financial_services__payments__readme_md
title: Financial Services — Payments
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-04-03
tags: []
---

# Financial Services — Payments

Architecture for payments advisory matters. This module defines solution frames, overlays, decision support, and agent infrastructure for the Payments practice area. It contains no legal or compliance analysis and no substantive requirements, thresholds, or procedures.

---

## Strategies

High-value engagement architectures that may orchestrate multiple solutions. Strategies require ML1 approval to create and live under `STRATEGIES/`.

---

## Primary Solutions

| # | Solution | Folder |
|---|----------|--------|
| 1 | MSB_INTAKE_AND_REGISTRATION | [../SOLUTIONS/MSB_INTAKE_AND_REGISTRATION/MODULES/MODULE_001_PRIMARY/WORKFLOWS/](../SOLUTIONS/MSB_INTAKE_AND_REGISTRATION/MODULES/MODULE_001_PRIMARY/WORKFLOWS/) |
| 2 | MSB_REVIEW | [../SOLUTIONS/MSB_REVIEW/MODULES/MODULE_001_PRIMARY/WORKFLOWS/](../SOLUTIONS/MSB_REVIEW/MODULES/MODULE_001_PRIMARY/WORKFLOWS/) |
| 3 | FINTRAC_RESPONSE | [../SOLUTIONS/FINTRAC_RESPONSE/MODULES/MODULE_001_PRIMARY/WORKFLOWS/](../SOLUTIONS/FINTRAC_RESPONSE/MODULES/MODULE_001_PRIMARY/WORKFLOWS/) |
| 4 | RPAA_REGISTRATION | [../SOLUTIONS/RPAA_REGISTRATION/MODULES/MODULE_001_PRIMARY/WORKFLOWS/](../SOLUTIONS/RPAA_REGISTRATION/MODULES/MODULE_001_PRIMARY/WORKFLOWS/) |
| 5 | RPAA_THREE_YEAR_REVIEW | [../SOLUTIONS/RPAA_THREE_YEAR_REVIEW/MODULES/MODULE_001_PRIMARY/WORKFLOWS/](../SOLUTIONS/RPAA_THREE_YEAR_REVIEW/MODULES/MODULE_001_PRIMARY/WORKFLOWS/) |

---

## Overlays

Overlays are shared modules invoked by solutions. They are not solutions themselves.

| Overlay | Folder |
|---------|--------|
| AML/KYC Program | [OVERLAYS/AML_KYC_PROGRAM/](OVERLAYS/AML_KYC_PROGRAM/) |
| Rails | [OVERLAYS/RAILS/](OVERLAYS/RAILS/) |
| Crypto | [OVERLAYS/CRYPTO/](OVERLAYS/CRYPTO/) |

---

## Provider Agreements

Drafting and review of provider agreements lives in FINANCIAL_SERVICES/CONTRACTS (not here). This practice area may reference provider agreement terms but does not produce or review them.

---

## Related Specialist Agents

- `00_SYSTEM/AGENTS/specs/marketing/MKT_MUGGAH_MONEY_SERVICES_AGENT.md`
- `00_SYSTEM/AGENTS/specs/marketing/MKT_MUGGAH_PAYMENT_SERVICES_AGENT.md`

These are Funnel 3 specialist agents cross-referenced to the financial
services practice area. They support internal issue mapping and scope
discipline only; they do not change doctrine or activate the parked LLP-036
practice-area initiative.

---

## Structure

| Directory / File | Purpose |
|------------------|---------|
| [STRATEGIES/](STRATEGIES/) | High-value engagement architectures |
| [../SOLUTIONS/](../SOLUTIONS/) | Canonical solution packet structure for this practice area |
| [OVERLAYS/](OVERLAYS/) | Shared overlay modules (AML/KYC, Rails, Crypto) |
| [AGENTS/](AGENTS/) | Agent catalog, permissions, handoffs |
| [DECISION_LENSES/](DECISION_LENSES/) | Analytical frameworks |
| [FAILURE_MODES/](FAILURE_MODES/) | Known failure patterns |
| [ISSUE_MAPS/](ISSUE_MAPS/) | Structured issue taxonomies |
| [QUESTION_BANKS/](QUESTION_BANKS/) | Intake and scoping questions |
| [REGULATORY_SURFACES/](REGULATORY_SURFACES/) | Statutory/regulatory touchpoints |
| [DECISION_REGISTRY.md](DECISION_REGISTRY.md) | Named decision points |
| [INTAKE_QUESTION_PACKS.md](INTAKE_QUESTION_PACKS.md) | Minimum viable fact sets per solution |
| [KNOWN_SAFE_DEFAULTS.md](KNOWN_SAFE_DEFAULTS.md) | Rebuttable default positions |
| [SOLUTION_COLLISION_MATRIX.md](SOLUTION_COLLISION_MATRIX.md) | Multi-solution routing |

---

## Operating Posture

Containment over completeness; explicit exit states; no assumed ongoing representation.

## Canonical Structure Note

Solution packet artifacts are now organized under:

`02_PLAYBOOKS/FINANCIAL_SERVICES/SOLUTIONS/[SPECIFIC_SOLUTION]/MODULES/[MODULE_ID]/{WORKFLOWS,TEMPLATES,CHECKLISTS}`
