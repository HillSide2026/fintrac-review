---
id: 02_playbooks__financial_services__solutions__msb_pre_registration_triage__solution_scope_md
title: Solution Scope: MSB_PRE_REGISTRATION_TRIAGE
owner: ML1
status: draft
created_date: 2026-06-20
last_updated: 2026-06-20
tags: [financial-services, payments, msb, fintrac, registration, triage]
---

# Solution Scope: MSB_PRE_REGISTRATION_TRIAGE

## Purpose

A structured legal triage for clients who are operating or planning to operate a
business with potential MSB characteristics, but have not yet registered with
FINTRAC and are uncertain whether registration is required.

This is the entry-point diagnostic before MSB_INTAKE_AND_REGISTRATION. It answers
the threshold question — does this client need to register? — and defines the
recommended path forward. It does not include the registration itself.

---

## Included

- Review of the client's current and planned business activities against PCMLTFA
  MSB categories (currency exchange, money transfer, virtual currency dealing,
  foreign exchange dealing, issuing or redeeming money orders or traveller's
  cheques)
- Legal assessment of whether registration with FINTRAC is required
- Identification of which MSB categories apply and any ambiguity or overlap
- Assessment of urgency and regulatory risk if the client is already operating
  without registration
- Assessment of whether foreign-MSB registration applies (Canada-facing activity
  without a Canadian establishment)
- Triage memorandum documenting the analysis, assumptions, and recommended path
- Referral recommendation to MSB_INTAKE_AND_REGISTRATION, exit, or escalation

## Excluded

- The registration itself (separate solution: MSB_INTAKE_AND_REGISTRATION)
- Drafting of AML/KYC policies or compliance program documents
- FINTRAC examination support (separate solution: FINTRAC_RESPONSE)
- Advice on RPAA/PSP registration obligations (separate regime)
- Ongoing compliance monitoring or advisory

## Sub-Specs

| Sub-Spec | Description |
|----------|-------------|
| Standard | Clear business model; one or two MSB categories to assess |
| Complex | Multiple categories, virtual currency overlap, foreign-MSB analysis, or ambiguous characterization |
| Urgent | Client is already operating; potential AMP exposure for unregistered activity; timeline compressed |

## Terminal States

| State | Description |
|-------|-------------|
| Proceed | Registration required — refer to MSB_INTAKE_AND_REGISTRATION |
| Exit | Registration not required — triage memo documents basis; no further action |
| Escalate | Active or imminent FINTRAC contact — refer to FINTRAC_RESPONSE before or alongside registration |
| Deferred | Insufficient facts; information request issued; matter paused |

## Escalation Hooks

- Client is already operating without registration and has received FINTRAC
  correspondence → refer to FINTRAC_RESPONSE immediately
- Business activities are ambiguous or span multiple contested MSB categories
  → escalate to ML1 before proceeding
- Foreign-MSB analysis required → flag for cross-border scope review
- Client insists registration is not required without a fact-based analysis →
  document and escalate before accepting that position

## Relationship to Other Solutions

- Precedes MSB_INTAKE_AND_REGISTRATION
- May run concurrently with or precede RPAA_REGISTRATION screening where dual
  registration (MSB + PSP) is likely
- Does not invoke MSB_REVIEW, which is a post-registration periodic assessment
