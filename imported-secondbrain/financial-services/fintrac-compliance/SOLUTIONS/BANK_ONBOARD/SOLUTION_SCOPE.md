---
id: 02_playbooks__financial_services__solutions__bank_onboard__solution_scope_md
title: Solution Scope: BANK_ONBOARD
owner: ML1
status: draft
created_date: 2026-06-23
last_updated: 2026-06-23
tags: [financial-services, payments, msb, banking, onboarding, aml]
---

# Solution Scope: BANK_ONBOARD

## Purpose

Legal and compliance advisory for MSBs, payment operators, and fintech companies
seeking to establish or replace a banking relationship in Canada.

Banks apply enhanced due diligence to MSBs and high-risk payment businesses.
Clients in this category routinely face refusals, extended diligence timelines,
and requests for compliance documentation that goes far beyond standard commercial
onboarding. This solution prepares the client to present a defensible compliance
posture and supports the relationship-building process through onboarding
completion.

---

## Included

- Assessment of the client's current regulatory and compliance posture as a
  prospective bank customer (MSB registration status, AML program, CAMLO, etc.)
- Preparation of a banking readiness package: compliance summary, organizational
  overview, FINTRAC registration confirmation, business model narrative, and
  anticipated transaction volume profile
- Guidance on beneficial ownership disclosure and corporate structure presentation
  to satisfy bank KYC requirements
- Review and commentary on bank KYC questionnaires and onboarding documentation
  requests
- Strategy advice on which institutions and payment rails to approach given the
  client's business model and risk profile
- Assistance responding to bank requests for additional information during
  the onboarding process
- Payment rail access scoping (Interac, SWIFT, ACH/EFT, domestic wire, FX)
  where relevant to the onboarding decision

## Excluded

- Negotiation of commercial banking terms (fees, float, credit)
- Drafting or updating AML/KYC policies (separate solution: MSB_REVIEW or
  MSB_INTAKE_AND_REGISTRATION)
- FINTRAC registration or amendment (separate solution: MSB_INTAKE_AND_REGISTRATION)
- Ongoing banking relationship management after onboarding completes
- Legal opinions on bank refusal or discrimination claims

## Sub-Specs

| Sub-Spec | Description |
|----------|-------------|
| First Bank Onboarding | Client has no existing Canadian banking relationship; full readiness package from scratch |
| Replacement Bank Onboarding | Client is replacing a terminated or exiting bank; may require expedited timeline and explanation of prior relationship |
| Multi-Bank Strategy Support | Client is building redundancy; two or more institutions being approached concurrently |
| Payment Rail Access Support | Onboarding is for a specific payment rail (Interac, SWIFT, correspondent banking) rather than a full commercial account |
| Onboarding Readiness Package | Standalone delivery of the compliance and KYC documentation package without ongoing bank-interface support |

## Terminal States

| State | Description |
|-------|-------------|
| Onboarded | Bank relationship established; solution complete |
| Referred | Client referred to a banking intermediary or specialist introducer; solution complete |
| Escalated — Compliance Gap | Client's compliance posture is insufficient to support onboarding; refer to MSB_REVIEW or MSB_INTAKE_AND_REGISTRATION before re-approaching banks |
| Deferred | No willing institution identified at this time; matter paused with documented strategy |

## Escalation Hooks

- Client does not have an active FINTRAC registration and is approaching banks
  that will require it → refer to MSB_INTAKE_AND_REGISTRATION first
- Client's AML/KYC program is undocumented or materially incomplete → refer to
  MSB_REVIEW before proceeding with bank approach
- Bank has requested a legal opinion on compliance status → escalate to ML1
- Prior banking relationship was terminated for cause (SAR/STR, AML concerns,
  fraud) → escalate to ML1 before engagement

## Relationship to Other Solutions

- Often follows MSB_INTAKE_AND_REGISTRATION (client is registered and now needs a bank)
- May be preceded by MSB_REVIEW if compliance program requires uplift before
  bank approach
- Distinct from BANK_REVIEW, which addresses existing relationships rather than
  new onboarding
