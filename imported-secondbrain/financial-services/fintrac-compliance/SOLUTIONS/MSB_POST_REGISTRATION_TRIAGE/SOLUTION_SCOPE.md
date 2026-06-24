---
id: 02_playbooks__financial_services__solutions__msb_post_registration_triage__solution_scope_md
title: Solution Scope: MSB_POST_REGISTRATION_TRIAGE
owner: ML1
status: draft
created_date: 2026-06-23
last_updated: 2026-06-23
tags: [financial-services, payments, msb, fintrac, registration, triage, aml]
---

# Solution Scope: MSB_POST_REGISTRATION_TRIAGE

## Purpose

A structured legal triage for clients who are already registered with FINTRAC as
an MSB and need a rapid assessment of whether their registration, compliance
program, and ongoing obligations remain accurate and sufficient.

This is the entry-point diagnostic after registration has been obtained — whether
immediately after initial registration, following a material business change, or
as a periodic check-in ahead of a formal AML review or FINTRAC examination. It
identifies the next required step but does not perform that step.

---

## Included

- Confirmation that existing FINTRAC registration reflects current business
  activities, MSB categories, and ownership structure
- Identification of business changes since registration that may require
  registration amendment or re-notification to FINTRAC
- High-level structural review of whether a compliant AML/KYC program is in place
  (policies, CAMLO appointment, risk assessment, training, record-keeping)
- Identification of upcoming or triggered compliance obligations, including the
  two-year effectiveness review requirement under PCMLTFA s. 9.6
- Identification of any registration inaccuracies that carry AMPs exposure
- Triage memorandum documenting findings and recommended path forward
- Referral recommendation to MSB_REVIEW, PCMLTFA_EFFECTIVENESS_REVIEW, or
  escalation as appropriate

## Excluded

- Amendment or correction of the FINTRAC registration itself
- Drafting or updating AML/KYC policies (separate solution: MSB_REVIEW)
- Formal s. 9.6 effectiveness review (separate solution: PCMLTFA_EFFECTIVENESS_REVIEW)
- FINTRAC examination support (separate solution: FINTRAC_RESPONSE)
- Ongoing compliance monitoring or advisory retainer

## Sub-Specs

| Sub-Spec | Description |
|----------|-------------|
| Post-Initial Registration | Client just registered; confirming program basics are in place and next obligations are understood |
| Post-Change | Material business change (new product, new category, ownership change, volume increase) since last registration review |
| Periodic Check-In | Routine triage with no specific trigger; confirms continued accuracy and no missed obligations |
| Pre-Effectiveness Review | Triage focused on readiness for the two-year effectiveness review; scopes what the review will require |

## Terminal States

| State | Description |
|-------|-------------|
| Cleared | Registration accurate; program structurally complete; no immediate action required |
| Refer to MSB_REVIEW | Program gaps or registration issues identified; refer to periodic compliance review |
| Refer to PCMLTFA_EFFECTIVENESS_REVIEW | Effectiveness review obligation triggered or overdue; refer immediately |
| Escalate | Registration inaccuracy with AMPs exposure, or FINTRAC contact received → refer to FINTRAC_RESPONSE |
| Deferred | Insufficient information; information request issued; matter paused |

## Escalation Hooks

- Registration reflects outdated categories, ownership, or address and client
  has been operating in that state for more than 30 days → AMPs exposure; escalate
- Effectiveness review has not been conducted in more than 24 months →
  refer to PCMLTFA_EFFECTIVENESS_REVIEW without delay
- Client has received FINTRAC correspondence since last registration review →
  refer to FINTRAC_RESPONSE immediately
- CAMLO is unfilled, departed, or unnamed on the registration →
  flag as priority gap before proceeding

## Relationship to Other Solutions

- Follows MSB_INTAKE_AND_REGISTRATION or MSB_PRE_REGISTRATION_TRIAGE
- May precede MSB_REVIEW, PCMLTFA_EFFECTIVENESS_REVIEW, or FINTRAC_RESPONSE
  depending on terminal state
- Does not itself perform any review or remediation — it scopes and routes
