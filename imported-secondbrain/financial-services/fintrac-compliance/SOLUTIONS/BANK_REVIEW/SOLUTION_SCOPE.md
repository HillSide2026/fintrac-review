---
id: 02_playbooks__financial_services__solutions__bank_review__solution_scope_md
title: Solution Scope: BANK_REVIEW
owner: ML1
status: draft
created_date: 2026-06-23
last_updated: 2026-06-23
tags: [financial-services, payments, msb, banking, de-risking, aml]
---

# Solution Scope: BANK_REVIEW

## Purpose

Legal and compliance advisory for MSBs, payment operators, and fintech companies
managing an existing banking relationship that is under pressure, subject to a
periodic review, or facing account closure or de-risking.

Banks conduct periodic enhanced due diligence reviews of high-risk customers and
may issue requests for updated compliance documentation, restrict services, or
terminate relationships. This solution supports the client in responding to those
reviews and in managing, stabilizing, or transitioning their banking relationships.

---

## Included

- Assessment of the compliance and regulatory posture the client needs to present
  to satisfy bank review requirements
- Review and commentary on bank EDD questionnaires, compliance attestation
  requests, and documentation demands issued during a periodic review
- Preparation of updated compliance summary, AML program documentation, and
  transaction volume narrative for bank submission
- Strategy and response guidance where a bank has issued a notice of concern,
  service restriction, or termination notice
- Exit and transition planning where account closure is confirmed or imminent,
  including identification of alternative institutions or payment rails
- Assessment of whether the client's compliance posture is sufficient to support
  the existing or a replacement relationship

## Excluded

- New bank onboarding (separate solution: BANK_ONBOARD)
- Negotiation of commercial banking terms (fees, float, credit)
- Drafting or updating AML/KYC policies (separate solution: MSB_REVIEW)
- Litigation or regulatory complaints against the bank for wrongful termination
- Advice on FINTRAC registration or amendment (separate solution:
  MSB_INTAKE_AND_REGISTRATION)

## Sub-Specs

| Sub-Spec | Description |
|----------|-------------|
| Periodic Banking Relationship Review | Bank has initiated a routine EDD review; client needs to respond with updated compliance documentation |
| Post-Issue / De-Risking Review | Bank has flagged the account, restricted services, or issued a de-risking notice; response and mitigation |
| Product or Volume Change Review | Client is adding a new product, payment rail, or transaction category requiring bank approval |
| Partner / Investor Banking Review | Bank is conducting diligence on a client's counterparty, investor, or institutional partner |
| Exit & Transition Assessment | Account closure is confirmed or imminent; transition planning and replacement institution strategy |

## Terminal States

| State | Description |
|-------|-------------|
| Relationship Stabilized | Bank review satisfied; relationship continues; solution complete |
| Product / Volume Approved | Bank approved the proposed change; solution complete |
| Transition Initiated | Account closure confirmed; client referred to BANK_ONBOARD for replacement |
| Escalated — Compliance Gap | Client's compliance posture is insufficient to satisfy bank review; refer to MSB_REVIEW |
| Escalated — Regulatory | FINTRAC correspondence or investigation is a factor in the bank's review → refer to FINTRAC_RESPONSE |

## Escalation Hooks

- Bank review appears connected to FINTRAC examination, SAR filing, or law
  enforcement inquiry → escalate to ML1 and refer to FINTRAC_RESPONSE
- Client's AML/KYC program is materially insufficient to support EDD response
  → refer to MSB_REVIEW before responding to the bank
- Bank has terminated the account and no alternative relationship exists →
  refer to BANK_ONBOARD immediately; assess urgency of business continuity risk
- Client has received simultaneous review notices from multiple banks →
  treat as elevated risk; escalate to ML1

## Relationship to Other Solutions

- Complement to BANK_ONBOARD — addresses existing relationships rather than
  new onboarding
- May run concurrently with FINTRAC_RESPONSE where bank and regulator issues
  are connected
- May refer to MSB_REVIEW where compliance uplift is required before bank
  response can be completed
