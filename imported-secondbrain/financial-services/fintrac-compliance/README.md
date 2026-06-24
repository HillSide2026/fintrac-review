# FINTRAC Compliance — Imported Playbook Content

**Imported from:** `ll-secondbrain_fresh/02_PLAYBOOKS/FINANCIAL_SERVICES/`  
**Import date:** 2026-06-20  
**Purpose:** Reference material for the SkillApp FINTRAC Effectiveness Review intake workflow. These files are read-only references — do not edit them here. Source of truth remains `ll-secondbrain_fresh`.

---

## What Is Here

36 files selected from the Financial Services playbook in `ll-secondbrain_fresh`. Only FINTRAC-relevant materials were copied. The folder structure mirrors the source exactly.

The source directory contains ~200 files across the full Financial Services practice area. This import captures the FINTRAC/AML/MSB compliance subset, covering the substantive content most directly relevant to the FINTRAC Effectiveness Review service.

---

## Copied Files

### Root

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `MARKET_STRUCTURE_FRAMEWORK.md` | `FINANCIAL_SERVICES/MARKET_STRUCTURE_FRAMEWORK.md` | Foundational framework defining all Canadian financial services regulatory levels; explicitly covers PCMLTFA/FINTRAC dual-registration, MSB obligations, and AML/ATF at Level 1. Approved document (v1.3). |
| `README.md` (this file) | — | Index created for this import. Replaces the copied source README. |

---

### PAYMENTS/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `PAYMENTS/README.md` | `FINANCIAL_SERVICES/PAYMENTS/README.md` | Describes the payments practice area architecture; maps solutions, overlays, and strategies including all FINTRAC-adjacent structures. |
| `PAYMENTS/SOLUTION_COLLISION_MATRIX.md` | `FINANCIAL_SERVICES/PAYMENTS/SOLUTION_COLLISION_MATRIX.md` | Routing rules when solutions interact; explicitly includes FINTRAC_RESPONSE pre-emption logic. |
| `PAYMENTS/DECISION_REGISTRY.md` | `FINANCIAL_SERVICES/PAYMENTS/DECISION_REGISTRY.md` | Named decision points for MSB/FINTRAC solutions. Currently mostly placeholder but structurally important for future AI agent use. |
| `PAYMENTS/INTAKE_QUESTION_PACKS.md` | `FINANCIAL_SERVICES/PAYMENTS/INTAKE_QUESTION_PACKS.md` | Minimum viable fact sets for MSB, FINTRAC, and related solutions. Placeholder content but the framework is relevant. |
| `PAYMENTS/KNOWN_SAFE_DEFAULTS.md` | `FINANCIAL_SERVICES/PAYMENTS/KNOWN_SAFE_DEFAULTS.md` | Rebuttable default positions for FINTRAC/MSB engagements. Currently placeholder but part of the decision framework. |

#### PAYMENTS/OVERLAYS/AML_KYC_PROGRAM/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `PAYMENTS/OVERLAYS/AML_KYC_PROGRAM/README.md` | `FINANCIAL_SERVICES/PAYMENTS/OVERLAYS/AML_KYC_PROGRAM/README.md` | Shared AML/KYC compliance program overlay — invoked by MSB_INTAKE_AND_REGISTRATION, MSB_REVIEW, and FINTRAC_RESPONSE. Core to compliance program review work. |
| `PAYMENTS/OVERLAYS/AML_KYC_PROGRAM/INTERFACES.md` | `FINANCIAL_SERVICES/PAYMENTS/OVERLAYS/AML_KYC_PROGRAM/INTERFACES.md` | Defines which solutions invoke the AML/KYC overlay and what it produces/consumes. |

#### PAYMENTS/STRATEGIES/CAMLO/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `PAYMENTS/STRATEGIES/CAMLO/STRATEGY_SCOPE.md` | `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/CAMLO/STRATEGY_SCOPE.md` | Defines LL's position on CAMLO appointments and the critical independence constraint for PCMLTFA Effectiveness Reviews. Directly governs when LL can/cannot conduct an effectiveness review. |
| `PAYMENTS/STRATEGIES/CAMLO/COMPONENT_SOLUTIONS.md` | `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/CAMLO/COMPONENT_SOLUTIONS.md` | Lists solutions available in supporting-counsel CAMLO context (MSB_REVIEW, FINTRAC_RESPONSE). |

#### PAYMENTS/STRATEGIES/ONGOING_AML_COUNSEL_RETAINER/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `PAYMENTS/STRATEGIES/ONGOING_AML_COUNSEL_RETAINER/STRATEGY_SCOPE.md` | `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/ONGOING_AML_COUNSEL_RETAINER/STRATEGY_SCOPE.md` | Ongoing AML legal retainer — natural follow-on to effectiveness review; covers FINTRAC advisory, policy review, and ongoing monitoring. |
| `PAYMENTS/STRATEGIES/ONGOING_AML_COUNSEL_RETAINER/COMPONENT_SOLUTIONS.md` | `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/ONGOING_AML_COUNSEL_RETAINER/COMPONENT_SOLUTIONS.md` | Component solutions: AML_HEALTH_CHECK, FINTRAC_RESPONSE, PCMLTFA_EFFECTIVENESS_REVIEW, MSB_REVIEW. |

#### PAYMENTS/STRATEGIES/PAYMENTS_MSB_PSP_REGULATORY_COUNSEL/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `PAYMENTS/STRATEGIES/PAYMENTS_MSB_PSP_REGULATORY_COUNSEL/STRATEGY_SCOPE.md` | `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/PAYMENTS_MSB_PSP_REGULATORY_COUNSEL/STRATEGY_SCOPE.md` | High-level regulatory counsel strategy for MSB/PSP clients. Mostly TBD but included as the strategy frame that encompasses FINTRAC work. |
| `PAYMENTS/STRATEGIES/PAYMENTS_MSB_PSP_REGULATORY_COUNSEL/COMPONENT_SOLUTIONS.md` | `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/PAYMENTS_MSB_PSP_REGULATORY_COUNSEL/COMPONENT_SOLUTIONS.md` | Lists MSB_INTAKE_AND_REGISTRATION, FINTRAC_RESPONSE, and MSB_REVIEW as component solutions. |

---

### SOLUTIONS/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `SOLUTIONS/README.md` | `FINANCIAL_SERVICES/SOLUTIONS/README.md` | Directory overview for all solution packets. |
| `SOLUTIONS/SOLUTION_INDEX.md` | `FINANCIAL_SERVICES/SOLUTIONS/SOLUTION_INDEX.md` | Master index of all 24 solutions with sub-specs. Useful as a map; includes all FINTRAC-relevant solutions (items 1–3, 6–9, 21–24). |

#### SOLUTIONS/PCMLTFA_EFFECTIVENESS_REVIEW/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `SOLUTIONS/PCMLTFA_EFFECTIVENESS_REVIEW/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/PCMLTFA_EFFECTIVENESS_REVIEW/SOLUTION_SCOPE.md` | **Core.** Defines the mandatory two-year PCMLTFA effectiveness review service — the primary service the SkillApp intake is designed to sell. Includes independence constraint and scope boundaries. |
| `SOLUTIONS/PCMLTFA_EFFECTIVENESS_REVIEW/SOLUTION_ASSEMBLY.md` | `FINANCIAL_SERVICES/SOLUTIONS/PCMLTFA_EFFECTIVENESS_REVIEW/SOLUTION_ASSEMBLY.md` | Inputs and assembly map for the effectiveness review engagement. |

#### SOLUTIONS/AML_HEALTH_CHECK/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `SOLUTIONS/AML_HEALTH_CHECK/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/AML_HEALTH_CHECK/SOLUTION_SCOPE.md` | Practitioner-led AML program diagnostic — the lighter-weight precursor to a formal PCMLTFA effectiveness review. Entry point for clients not yet ready for a full review. |

#### SOLUTIONS/FINTRAC_RESPONSE/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `SOLUTIONS/FINTRAC_RESPONSE/MODULES/MODULE_001_PRIMARY/WORKFLOWS/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/FINTRAC_RESPONSE/.../SOLUTION_SCOPE.md` | Scope for FINTRAC examination response — the downstream engagement when a client is under or anticipating FINTRAC scrutiny. Directly relates to intake fields for prior examinations and urgency. |
| `SOLUTIONS/FINTRAC_RESPONSE/MODULES/MODULE_001_PRIMARY/WORKFLOWS/SOLUTION_ASSEMBLY.md` | same | Assembly components: correspondence analysis, document inventory, gap analysis, response drafting. |
| `SOLUTIONS/FINTRAC_RESPONSE/MODULES/MODULE_001_PRIMARY/WORKFLOWS/RISK_PROFILE.md` | same | Risk dimensions: deadline-driven, escalation sensitivity, information asymmetry. Directly informs how urgency is assessed in the intake form. |
| `SOLUTIONS/FINTRAC_RESPONSE/MODULES/MODULE_001_PRIMARY/WORKFLOWS/COMMON_ARTIFACTS.md` | same | Standard deliverables: FINTRAC correspondence log, document production index, response memorandum. |

#### SOLUTIONS/MSB_REVIEW/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `SOLUTIONS/MSB_REVIEW/MODULES/MODULE_001_PRIMARY/WORKFLOWS/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/MSB_REVIEW/.../SOLUTION_SCOPE.md` | MSB compliance review — activity characterization, registration status, AML/KYC framework alignment. Covers quarterly and annual internal review workstreams relevant to reporting entities. |
| `SOLUTIONS/MSB_REVIEW/MODULES/MODULE_001_PRIMARY/WORKFLOWS/SOLUTION_ASSEMBLY.md` | same | Assembly: activity mapping, registration consistency, change detection, framework adequacy, issue mapping. |
| `SOLUTIONS/MSB_REVIEW/MODULES/MODULE_001_PRIMARY/WORKFLOWS/RISK_PROFILE.md` | same | Risk characteristics: moderate regulatory risk, change-driven risk, AML framework misalignment. |

#### SOLUTIONS/MSB_INTAKE_AND_REGISTRATION/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `SOLUTIONS/MSB_INTAKE_AND_REGISTRATION/MODULES/MODULE_001_PRIMARY/WORKFLOWS/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/MSB_INTAKE_AND_REGISTRATION/.../SOLUTION_SCOPE.md` | MSB registration support and initial AML/KYC policy drafting — the entry-point solution for unregistered MSBs. Relevant to intake cases where the client is unregistered or uncertain about FINTRAC registration status. |
| `SOLUTIONS/MSB_INTAKE_AND_REGISTRATION/MODULES/MODULE_001_PRIMARY/WORKFLOWS/SOLUTION_ASSEMBLY.md` | same | Assembly: activity characterization, MSB determination, registration alignment, policy drafting. |
| `SOLUTIONS/MSB_INTAKE_AND_REGISTRATION/MODULES/MODULE_001_PRIMARY/WORKFLOWS/COMMON_ARTIFACTS.md` | same | Standard artifacts: MSB classification summary, activity mapping table, draft AML/KYC policy, issue/gap list. |

#### SOLUTIONS/STR_FILING/ and SOLUTIONS/SUSPICIOUS_TRANSACTION_TRIAGE/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `SOLUTIONS/STR_FILING/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/STR_FILING/SOLUTION_SCOPE.md` | STR preparation and filing — directly relevant to the reporting processes section of the intake (STR/LCTR/EFTR checkboxes). Covers single STR, batch filing, and voluntary disclosure. |
| `SOLUTIONS/SUSPICIOUS_TRANSACTION_TRIAGE/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/SUSPICIOUS_TRANSACTION_TRIAGE/SOLUTION_SCOPE.md` | Pre-STR triage — legal analysis of whether reporting is required; produces internal playbook. Entry-level FINTRAC/STR solution. |

#### SOLUTIONS/BANK_ONBOARD/ and SOLUTIONS/BANK_REVIEW/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `SOLUTIONS/BANK_ONBOARD/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/BANK_ONBOARD/SOLUTION_SCOPE.md` | Banking relationship onboarding for MSBs — directly relevant to MSB clients who need a bank willing to serve an FINTRAC-registered business. Includes compliance readiness package, bank KYC positioning, and payment rail access. Added 2026-06-23. |
| `SOLUTIONS/BANK_REVIEW/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/BANK_REVIEW/SOLUTION_SCOPE.md` | Banking relationship review and de-risking response — relevant where bank pressure (EDD review, service restriction, account closure notice) intersects with a client's FINTRAC compliance posture. Added 2026-06-23. |

#### SOLUTIONS/MSB_PRE_REGISTRATION_TRIAGE/ and SOLUTIONS/MSB_POST_REGISTRATION_TRIAGE/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `SOLUTIONS/MSB_PRE_REGISTRATION_TRIAGE/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/MSB_PRE_REGISTRATION_TRIAGE/SOLUTION_SCOPE.md` | Threshold triage for businesses that may require FINTRAC MSB registration. Entry-point diagnostic before MSB_INTAKE_AND_REGISTRATION — determines whether registration is required and which categories apply. Added 2026-06-23. |
| `SOLUTIONS/MSB_POST_REGISTRATION_TRIAGE/SOLUTION_SCOPE.md` | `FINANCIAL_SERVICES/SOLUTIONS/MSB_POST_REGISTRATION_TRIAGE/SOLUTION_SCOPE.md` | Post-registration triage for existing FINTRAC-registered MSBs — confirms registration accuracy, identifies business changes requiring amendment, and assesses whether the two-year effectiveness review obligation has been triggered. Routes to MSB_REVIEW, PCMLTFA_EFFECTIVENESS_REVIEW, or FINTRAC_RESPONSE. Added 2026-06-23. |

---

### WORKFLOWS/

| File | Source Path | Reason Included |
|------|-------------|-----------------|
| `WORKFLOWS/payments/initial_screening/ARE_THEY_AN_MSB.md` | `FINANCIAL_SERVICES/WORKFLOWS/payments/initial_screening/ARE_THEY_AN_MSB.md` | Internal first-pass screen for MSB/FINTRAC perimeter issues. Covers virtual currency, remittance, AML/reporting obligations. Key tool for classifying reporting entities at intake. |

---

## Excluded Files — With Reasons

### SOLUTIONS/BANK_ONBOARD/ and SOLUTIONS/BANK_REVIEW/ — scaffold (MODULES/README.md)
Only scaffold READMEs exist at the module layer; no substantive module-level content. The top-level SOLUTION_SCOPE.md for each was written and imported (see Copied Files above). The MODULES scaffold files were excluded as they contain no compliance content.

### SOLUTIONS/RPAA_REGISTRATION/, SOLUTIONS/RPAA_THREE_YEAR_REVIEW/, SOLUTIONS/RPAA_REPORT/
The Retail Payment Activities Act (RPAA) is a separate regulatory regime administered by the Bank of Canada. RPAA obligations (PSP registration, operational risk framework, safeguarding) are distinct from FINTRAC/PCMLTFA. May overlap when a client is both an MSB and a PSP — but the RPAA-only content is out of scope for this import. Excluded.

### SOLUTIONS/CARF_* (10 solution files)
The OECD Crypto-Asset Reporting Framework (CARF) is a CRA/tax reporting obligation, not a FINTRAC/AML regime. The CARF_PROGRAM strategy explicitly states "FINTRAC compliance (separate solutions)" as out of scope. Excluded.

### PAYMENTS/STRATEGIES/CARF_PROGRAM/
Same reason as CARF solutions above. CRA/tax reporting, not FINTRAC. Excluded.

### PAYMENTS/STRATEGIES/ONGOING_PAYMENTS_COUNSEL/
General payments regulatory counsel retainer — not AML/FINTRAC specific. The AML-specific retainer (ONGOING_AML_COUNSEL_RETAINER) was included instead. Excluded.

### PAYMENTS/OVERLAYS/CRYPTO/ and PAYMENTS/OVERLAYS/RAILS/
Both overlays are currently placeholder-only (README.md and INTERFACES.md with no substantive content). CRYPTO overlay may become relevant if virtual currency dealers are added to the FINTRAC intake scope — it is invoked by FINTRAC_RESPONSE and MSB_REVIEW when virtual currency is involved. Re-evaluate when content is added to ll-secondbrain. Excluded for now.

### PAYMENTS/AGENTS/ (6 files)
Agent infrastructure files: AGENT_CATALOG.md, HANDOFFS.md, PERMISSIONS_MATRIX.md, versioned architect specs. These define AI agent configurations for the ll-secondbrain runtime system. No substantive legal or compliance content. Excluded.

### PAYMENTS/DECISION_LENSES/, PAYMENTS/FAILURE_MODES/, PAYMENTS/ISSUE_MAPS/, PAYMENTS/QUESTION_BANKS/, PAYMENTS/REGULATORY_SURFACES/
All placeholder-only directories (README + template files, no substantive entries). None contain FINTRAC-specific analysis. Excluded pending content.

### WORKFLOWS/payments/initial_screening/ARE_THEY_A_PSP.md
PSP/RPAA-focused classification screen. RPAA is a separate regime. May become relevant if a future intake version covers dual-registered MSB+PSP entities. Flagged for re-evaluation — excluded for now.

### WORKFLOWS/payments/initial_screening/ARE_THERE_SECURITIES_ISSUES.md
Securities law classification screen. Not FINTRAC-relevant. Excluded.

### WORKFLOWS/payments/ metadata files (acceptance.md, metadata.yaml, steps.yaml throughout)
Workflow execution infrastructure for the ll-secondbrain automated workflow system. No substantive compliance content. Excluded.

### PAYMENTS/STRATEGIES/PAYMENTS_MSB_PSP_REGULATORY_COUNSEL/STRATEGY_ARCHITECTURE.md, RISK_SURFACE.md, VERSION.md
All contain only `TBD` or minimal placeholder content. No substantive material. Excluded.

### SOLUTIONS/SOLUTION_PACKET_TEMPLATE/
Boilerplate template for creating new solution packets in ll-secondbrain. Not a substantive compliance document. Excluded.

---

## Source Folders Reviewed

| Folder | Files in Source | Files Included |
|--------|----------------|---------------|
| `FINANCIAL_SERVICES/` (root) | 2 | 2 |
| `FINANCIAL_SERVICES/PAYMENTS/` (top-level files only) | 7 | 5 |
| `FINANCIAL_SERVICES/PAYMENTS/AGENTS/` | 6 | 0 — agent infrastructure |
| `FINANCIAL_SERVICES/PAYMENTS/DECISION_LENSES/` | 3 | 0 — placeholders |
| `FINANCIAL_SERVICES/PAYMENTS/FAILURE_MODES/` | 3 | 0 — placeholders |
| `FINANCIAL_SERVICES/PAYMENTS/ISSUE_MAPS/` | 3 | 0 — placeholders |
| `FINANCIAL_SERVICES/PAYMENTS/QUESTION_BANKS/` | 3 | 0 — placeholders |
| `FINANCIAL_SERVICES/PAYMENTS/REGULATORY_SURFACES/` | 3 | 0 — placeholders |
| `FINANCIAL_SERVICES/PAYMENTS/OVERLAYS/AML_KYC_PROGRAM/` | 2 | 2 |
| `FINANCIAL_SERVICES/PAYMENTS/OVERLAYS/CRYPTO/` | 2 | 0 — placeholders; RPAA/crypto regime |
| `FINANCIAL_SERVICES/PAYMENTS/OVERLAYS/RAILS/` | 2 | 0 — placeholders; payment rails |
| `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/CAMLO/` | 2 | 2 |
| `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/CARF_PROGRAM/` | 3 | 0 — CRA/tax, not FINTRAC |
| `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/ONGOING_AML_COUNSEL_RETAINER/` | 2 | 2 |
| `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/ONGOING_PAYMENTS_COUNSEL/` | 2 | 0 — general payments |
| `FINANCIAL_SERVICES/PAYMENTS/STRATEGIES/PAYMENTS_MSB_PSP_REGULATORY_COUNSEL/` | 5 | 2 — scope + components only |
| `FINANCIAL_SERVICES/SOLUTIONS/` (root) | 5 | 2 — index + readme |
| `FINANCIAL_SERVICES/SOLUTIONS/PCMLTFA_EFFECTIVENESS_REVIEW/` | 2 | 2 |
| `FINANCIAL_SERVICES/SOLUTIONS/AML_HEALTH_CHECK/` | 1 | 1 (assembly not yet drafted in source) |
| `FINANCIAL_SERVICES/SOLUTIONS/FINTRAC_RESPONSE/` (module files) | 8 | 4 — substantive files only |
| `FINANCIAL_SERVICES/SOLUTIONS/MSB_REVIEW/` (module files) | 8 | 3 — substantive files only |
| `FINANCIAL_SERVICES/SOLUTIONS/MSB_INTAKE_AND_REGISTRATION/` (module files) | 8 | 3 — substantive files only |
| `FINANCIAL_SERVICES/SOLUTIONS/STR_FILING/` | 1 | 1 |
| `FINANCIAL_SERVICES/SOLUTIONS/SUSPICIOUS_TRANSACTION_TRIAGE/` | 1 | 1 |
| `FINANCIAL_SERVICES/SOLUTIONS/BANK_ONBOARD/` | 5 | 1 — SOLUTION_SCOPE.md (written 2026-06-23); module scaffold excluded |
| `FINANCIAL_SERVICES/SOLUTIONS/BANK_REVIEW/` | 5 | 1 — SOLUTION_SCOPE.md (written 2026-06-23); module scaffold excluded |
| `FINANCIAL_SERVICES/SOLUTIONS/MSB_PRE_REGISTRATION_TRIAGE/` | 1 | 1 — new solution (written 2026-06-23) |
| `FINANCIAL_SERVICES/SOLUTIONS/MSB_POST_REGISTRATION_TRIAGE/` | 1 | 1 — new solution (written 2026-06-23) |
| `FINANCIAL_SERVICES/SOLUTIONS/RPAA_REGISTRATION/` | 8 | 0 — RPAA regime |
| `FINANCIAL_SERVICES/SOLUTIONS/RPAA_THREE_YEAR_REVIEW/` | 8 | 0 — RPAA regime |
| `FINANCIAL_SERVICES/SOLUTIONS/RPAA_REPORT/` | 2 | 0 — RPAA regime |
| `FINANCIAL_SERVICES/SOLUTIONS/CARF_*/` (10 solutions, ~10 files) | ~10 | 0 — CRA/tax reporting |
| `FINANCIAL_SERVICES/SOLUTIONS/SOLUTION_PACKET_TEMPLATE/` | 8 | 0 — boilerplate template |
| `FINANCIAL_SERVICES/WORKFLOWS/payments/initial_screening/` | 7 | 1 — ARE_THEY_AN_MSB only |
| `FINANCIAL_SERVICES/WORKFLOWS/payments/` (other subfolders) | ~35 | 0 — infrastructure + placeholders |

---

## SkillApp Architecture — Confirmation

No SkillApp source files were modified. The import is strictly additive:

- No changes to `app/`, `components/`, `lib/`, `public/`, or any TypeScript/Next.js files
- No changes to `package.json`, `tsconfig.json`, `next.config.js`, or any config
- No changes to `.env.example` or `.env.local`
- No changes to existing skills in `fintrac-effectiveness-review/`
- The new folder `imported-secondbrain/` is documentation-only (markdown files) and is not imported or referenced by any application code

---

## Notes on Uncertainty

1. **PAYMENTS/STRATEGIES/PAYMENTS_MSB_PSP_REGULATORY_COUNSEL/** — Strategy scope and architecture are largely `TBD`. Included because the component solutions list is substantive. Re-import if the strategy is fleshed out in ll-secondbrain.

2. **PAYMENTS/INTAKE_QUESTION_PACKS.md, KNOWN_SAFE_DEFAULTS.md, DECISION_REGISTRY.md** — All currently placeholder/template only. Included as structural frames for FINTRAC decision-making. Monitor ll-secondbrain for updates.

3. **WORKFLOWS/payments/initial_screening/ARE_THEY_A_PSP.md** — Excluded as RPAA-focused, but many reporting entities are dual-registered MSBs and PSPs. If the intake is extended to cover dual-registration, add this file.

4. **AML_HEALTH_CHECK** — Only `SOLUTION_SCOPE.md` exists in the source. The `SOLUTION_ASSEMBLY.md` has not been drafted yet in ll-secondbrain. Not a missing copy.

5. **CRYPTO overlay** — Excluded as placeholder, but the FINTRAC_RESPONSE and MSB_REVIEW solutions both invoke it when virtual currency dealing is involved. Virtual currency dealers are FINTRAC-reporting entities. Re-evaluate when the overlay is populated.
