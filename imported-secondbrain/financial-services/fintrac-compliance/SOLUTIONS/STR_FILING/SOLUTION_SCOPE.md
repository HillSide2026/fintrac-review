---
id: 02_playbooks__financial_services__solutions__str_filing__solution_scope_md
title: Solution Scope: STR Filing
owner: ML1
status: draft
created_date: 2026-03-23
last_updated: 2026-03-23
tags: [financial-services, payments, aml, str, fintrac, reporting]
---

# Solution Scope: STR Filing

## Purpose

Preparation and submission of a Suspicious Transaction Report (STR) to FINTRAC
under PCMLTFA s. 7(1). Engages where a reporting obligation has been identified
(through SUSPICIOUS_TRANSACTION_TRIAGE or independently) and the client requires
legal counsel to prepare and file the report.

This is the core FINTRAC/STR solution. May follow from triage or be initiated
directly where the STR obligation is already established.

---

## Included

- Final triage confirmation and obligation analysis (if not already completed)
- Collection and organization of required transaction data and supporting facts
- Preparation of FINTRAC STR in prescribed format
- Legal review of the STR for accuracy, completeness, and privilege
- Coordination with client on timing and submission logistics
- Client record of the filed STR and related legal file
- Post-filing advisory on any follow-on obligations or retention requirements

## Sub-Specs

| Sub-Spec | Description |
|----------|-------------|
| Single STR — Simple | Isolated transaction; clear facts; straightforward obligation |
| Single STR — Complex | Multiple parties, structuring concerns, or regulatory judgment required |
| Batch Filing | Multiple STRs arising from same pattern or review period |
| Voluntary Disclosure STR | Late or missed STR; voluntary disclosure to FINTRAC |

## Excluded

- Initial suspicious transaction triage where obligation not yet determined
  (use SUSPICIOUS_TRANSACTION_TRIAGE first)
- FINTRAC examination support arising from prior STR filings
  (separate solution: FINTRAC_RESPONSE)
- Preparation of LVTRs, EFTRs, or other FINTRAC reports (separate engagements)
- Ongoing transaction monitoring or compliance program work

## Escalation Triggers

- Filed STR triggers FINTRAC examination or follow-up inquiry → refer to FINTRAC_RESPONSE
- Pattern underlying STR indicates systemic program failure → refer to
  AML_HEALTH_CHECK or PCMLTFA_EFFECTIVENESS_REVIEW
- Evidence of proceeds of crime or ongoing criminal enterprise → escalate to ML1

## Execution Playbook Reference

- TBD
